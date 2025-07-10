'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Cross, Download, FileText, Users, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Link from 'next/link';

interface Registration {
  objectId: string;
  nama: string;
  sekolah: string;
  instagram: string;
  no_hp: string;
  created: string;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // Simple password authentication (in production, use proper authentication)
  const ADMIN_PASSWORD = 'gppitulungagung';

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di panel admin",
      });
    } else {
      toast({
        title: "Login Gagal",
        description: "Password salah. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://shinyroad-us.backendless.app/api/data/formulir');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data registrasi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(212, 175, 55); // Gold color
    doc.text('Data Registrasi KKR', 14, 22);
    
    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Registrasi: ${registrations.length}`, 14, 32);
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 40);

    // Table
    const tableData = registrations.map(reg => [
      reg.nama,
      reg.sekolah,
      reg.instagram,
      reg.no_hp,
      new Date(reg.created).toLocaleDateString('id-ID')
    ]);

    autoTable(doc, {
      head: [['Nama', 'Sekolah', 'Instagram', 'Nomor HP', 'Tanggal Daftar']],
      body: tableData,
      startY: 50,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [30, 64, 175], // Blue color
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    doc.save('registrasi-kkr.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      registrations.map(reg => ({
        'Nama': reg.nama,
        'Sekolah': reg.sekolah,
        'Instagram': reg.instagram,
        'Nomor HP': reg.no_hp,
        'Tanggal Daftar': new Date(reg.created).toLocaleDateString('id-ID')
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrasi KKR');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'registrasi-kkr.xlsx');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full">
                  <Cross className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription className="text-blue-100">
                Masukkan password untuk mengakses data registrasi
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-900 font-medium">
                    Password Admin
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password admin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3"
                >
                  Login
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/">
                  <Button variant="outline" className="flex items-center gap-2 mx-auto">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Formulir
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-full shadow-lg">
              <Cross className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Panel Admin KKR
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kelola dan export data registrasi peserta Kebaktian Kebangunan Rohani
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Formulir
            </Button>
          </Link>
          <Button
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Data Registrasi
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Total registrasi: {registrations.length} orang
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={exportToPDF}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2 bg-white/20 text-white hover:bg-white/30"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </Button>
                <Button
                  onClick={exportToExcel}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2 bg-white/20 text-white hover:bg-white/30"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </Button>
                <Button
                  onClick={fetchRegistrations}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2 bg-white/20 text-white hover:bg-white/30"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="font-semibold text-blue-900">No</TableHead>
                    <TableHead className="font-semibold text-blue-900">Nama</TableHead>
                    <TableHead className="font-semibold text-blue-900">Sekolah</TableHead>
                    <TableHead className="font-semibold text-blue-900">Instagram</TableHead>
                    <TableHead className="font-semibold text-blue-900">Nomor HP</TableHead>
                    <TableHead className="font-semibold text-blue-900">Tanggal Daftar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration, index) => (
                    <TableRow key={registration.objectId} className="hover:bg-blue-50/50">
                      <TableCell className="font-medium text-blue-900">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {registration.nama}
                      </TableCell>
                      <TableCell>{registration.sekolah}</TableCell>
                      <TableCell className="text-pink-600 font-medium">
                        {registration.instagram}
                      </TableCell>
                      <TableCell>{registration.no_hp}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-700 border-blue-200">
                          {new Date(registration.created).toLocaleDateString('id-ID')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {registrations.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada registrasi</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-blue-200">
          <p className="text-blue-700 font-medium">
            Panel Admin - Tuhan memberkati pelayanan ini
          </p>
          <div className="mt-4 flex justify-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-full">
              <Cross className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}