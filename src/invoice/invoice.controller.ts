import { Controller, Get, Param, Res } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Invoice } from './entities/invoice.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiOperation({ summary: 'Get invoice PDF by trip ID' })
  @Get('trip/:tripId')
  async getInvoicePDFByTripId(
    @Param('tripId') tripId: string,
    @Res() res: Response,
  ): Promise<void> {
    const invoice = await this.invoiceService.findByTripId(+tripId);
    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }

    const pdfBuffer = await this.invoiceService.generatePDF(invoice);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${invoice.id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @ApiOperation({ summary: 'Get all invoices for a passenger' })
  @Get('passenger/:passengerId')
  findByPassengerId(
    @Param('passengerId') passengerId: string,
  ): Promise<Invoice[]> {
    return this.invoiceService.findByPassengerId(+passengerId);
  }

  @ApiOperation({ summary: 'Get all invoices for a passenger' })
  @Get('trip/:tripId')
  findByTripId(@Param('tripId') tripId: string): Promise<Invoice> {
    return this.invoiceService.findByTripId(+tripId);
  }

  @ApiOperation({ summary: 'Get all invoices for a driver' })
  @Get('driver/:driverId')
  findByDriverId(@Param('driverId') driverId: string): Promise<Invoice[]> {
    return this.invoiceService.findByDriverId(+driverId);
  }
}
