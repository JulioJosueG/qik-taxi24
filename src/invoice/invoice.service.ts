import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Trip } from '../trip/entities/trip.entity';
import * as PDFDocument from 'pdfkit';
import { format } from 'date-fns';

@Injectable()
export class InvoiceService {
  private readonly COST_PER_KILOMETER = 2;
  private readonly TAX_RATE = 0.1;

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async createFromTrip(trip: Trip, distance: number): Promise<Invoice> {
    // Base cost calculation
    const baseCost = distance * this.COST_PER_KILOMETER;

    // Tax calculation
    const tax = baseCost * this.TAX_RATE;

    // Subtotal is the base cost
    const subtotal = baseCost;

    // Total is subtotal plus tax
    const total = +(subtotal + tax).toFixed(2);

    const invoice = this.invoiceRepository.create({
      tripId: trip.id,
      distance,
      baseCost,
      tax,
      subtotal,
      total,
    });

    return this.invoiceRepository.save(invoice);
  }

  async generatePDF(invoice: Invoice): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      // Collect PDF chunks
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add company logo (you can add your logo here)
      // doc.image('path/to/logo.png', 50, 45, { width: 50 });

      // Add company info
      doc.fontSize(20).text('QIK TAXI', 50, 50);
      doc.fontSize(10).text('123 Taxi Street', 50, 80);
      doc.text('New York, NY 10001', 50, 95);
      doc.text('Phone: (555) 123-4567', 50, 110);
      doc.text('Email: info@qiktaxi.com', 50, 125);

      // Add invoice details
      doc.fontSize(16).text('INVOICE', 50, 180);
      doc.fontSize(10).text(`Invoice #: ${invoice.id}`, 50, 210);
      doc.text(`Date: ${format(invoice.createdAt, 'PPP')}`, 50, 225);
      doc.text(`Trip ID: ${invoice.tripId}`, 50, 240);

      // Add line items
      const tableTop = 280;
      doc.fontSize(10);
      doc.text('Description', 50, tableTop);
      doc.text('Amount', 400, tableTop, { width: 100, align: 'right' });

      // Add line items
      doc.moveDown();
      doc.text('Base Cost', 50, tableTop + 30);
      doc.text(`$${invoice.baseCost.toFixed(2)}`, 400, tableTop + 30, {
        width: 100,
        align: 'right',
      });

      doc.text('Tax (10%)', 50, tableTop + 50);
      doc.text(`$${invoice.tax.toFixed(2)}`, 400, tableTop + 50, {
        width: 100,
        align: 'right',
      });

      // Add total
      doc.moveDown();
      doc.fontSize(12).text('Total', 50, tableTop + 90);
      doc.text(`$${invoice.total.toFixed(2)}`, 400, tableTop + 90, {
        width: 100,
        align: 'right',
      });

      // Add footer
      doc.fontSize(10).text('Thank you for choosing QIK TAXI!', 50, 700, {
        align: 'center',
        width: 500,
      });

      doc.end();
    });
  }

  async findByTripId(tripId: number): Promise<Invoice> {
    return this.invoiceRepository.findOne({ where: { tripId } });
  }

  async findByPassengerId(passengerId: number): Promise<Invoice[]> {
    return this.invoiceRepository
      .createQueryBuilder('invoice')
      .innerJoin('trip', 'trip', 'trip.id = invoice.tripId')
      .where('trip.passengerId = :passengerId', { passengerId })
      .getMany();
  }

  async findByDriverId(driverId: number): Promise<Invoice[]> {
    return this.invoiceRepository
      .createQueryBuilder('invoice')
      .innerJoin('trip', 'trip', 'trip.id = invoice.tripId')
      .where('trip.driverId = :driverId', { driverId })
      .getMany();
  }
}
