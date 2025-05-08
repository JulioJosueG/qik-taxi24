import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Trip } from '../trip/entities/trip.entity';
import * as PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { COST_PER_KILOMETER, TAX_RATE } from '../common/constants/rates';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async createFromTrip(trip: Trip, distance: number): Promise<Invoice> {
    this.logger.log(
      `Creating invoice for trip ${trip.id} with distance ${distance}km`,
    );
    // Base cost calculation
    const baseCost = distance * COST_PER_KILOMETER;

    // Tax calculation
    const tax = baseCost * TAX_RATE;

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
    this.logger.log(`Generating PDF for invoice ${invoice.id}`);
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      // Collect PDF chunks
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const startPosition = 50;

      doc.image('src/assets/taxi24Logo.png', 200, 45, {
        width: 100,
        height: 50,
      });

      // Add company info
      doc.fontSize(10).text('123 Taxi Street', startPosition, 100);
      doc.text('La Romana, LR 22000', startPosition, 110);
      doc.text('Phone: (809) 506-3933', startPosition, 125);
      doc.text('Email: info@qiktaxi.com', startPosition, 140);

      // Add invoice details
      doc.fontSize(16).text('INVOICE', startPosition, 195);
      doc.fontSize(10).text(`Invoice #: ${invoice.id}`, startPosition, 225);
      doc.text(`Date: ${format(invoice.createdAt, 'PPP')}`, startPosition, 240);
      doc.text(`Trip ID: ${invoice.tripId}`, startPosition, 255);

      // Add line items
      const tableTop = 280;
      doc.fontSize(10);
      doc.text('Description', 50, tableTop);
      doc.text('Amount', 400, tableTop, { width: 100, align: 'right' });

      // Add line items
      doc.moveDown();
      doc.text('Base Cost', 50, tableTop + 30);
      doc.text(`$${invoice.baseCost}`, 400, tableTop + 30, {
        width: 100,
        align: 'right',
      });

      doc.text(`Tax (10%)`, 50, tableTop + 50);
      doc.text(`$${invoice.tax}`, 400, tableTop + 50, {
        width: 100,
        align: 'right',
      });

      // Add total
      doc.moveDown();
      doc.fontSize(12).text('Total', 50, tableTop + 90);
      doc.text(`$${invoice.total}`, 400, tableTop + 90, {
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
    this.logger.log(`Finding invoice for trip ${tripId}`);
    return this.invoiceRepository.findOne({ where: { tripId } });
  }

  async findByPassengerId(passengerId: number): Promise<Invoice[]> {
    this.logger.log(`Finding invoices for passenger ${passengerId}`);
    return this.invoiceRepository
      .createQueryBuilder('invoice')
      .innerJoin('trip', 'trip', 'trip.id = invoice.tripId')
      .where('trip.passengerId = :passengerId', { passengerId })
      .getMany();
  }

  async findByDriverId(driverId: number): Promise<Invoice[]> {
    this.logger.log(`Finding invoices for driver ${driverId}`);
    return this.invoiceRepository
      .createQueryBuilder('invoice')
      .innerJoin('trip', 'trip', 'trip.id = invoice.tripId')
      .where('trip.driverId = :driverId', { driverId })
      .getMany();
  }
}
