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

  const ADMIN_PASSWORD = 'gppitulungagung';
  const AUTH_STORAGE_KEY = 'admin_authenticated'; 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari panel admin",
    });
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      // Construct URL with proper encoding for unlimited data fetch
      const baseUrl = 'https://shinyroad-us.backendless.app/api/data/formulir';
      const params = new URLSearchParams({
        pageSize: '1000', // Start with 1000, can be increased if needed
        sortBy: 'created desc'
      });
      const url = `${baseUrl}?${params.toString()}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      } else {
        // Get more detailed error information
        const errorText = await response.text();
        console.error('Backendless API Error:', response.status, errorText);
        throw new Error(`Failed to fetch registrations: ${response.status} - ${errorText}`);
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
    
    doc.setFontSize(18);
    doc.setTextColor(212, 175, 55); 
    doc.text('Data Registrasi KKR', 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Registrasi: ${registrations.length}`, 14, 32);
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 40);

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
        fillColor: [30, 64, 175],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 25 },
      }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="mx-auto shadow-xl border-0 bg-white/95 backdrop-blur dark:bg-gray-800/90 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg text-center dark:from-blue-800 dark:to-blue-900">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full dark:from-yellow-500 dark:to-yellow-700">
                  <Cross className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription className="text-blue-100 dark:text-blue-200">
                Masukkan password untuk mengakses data registrasi
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-900 font-medium dark:text-gray-200">
                    Password Admin
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password admin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:hover:bg-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 dark:from-yellow-600 dark:to-yellow-700 dark:hover:from-yellow-700 dark:hover:to-yellow-800"
                >
                  Login
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/">
                  <Button variant="outline" className="flex items-center gap-2 mx-auto border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-full shadow-lg dark:from-yellow-500 dark:to-yellow-700">
              <Cross className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4 dark:text-gray-100">
            Panel Admin KKR
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Kelola dan export data registrasi peserta Kebaktian Kebangunan Rohani
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full dark:from-yellow-500 dark:to-yellow-700"></div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 w-full justify-center dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Formulir
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50 w-full sm:w-auto dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/50"
          >
            Logout
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur dark:bg-gray-800/90 dark:border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white dark:from-blue-800 dark:to-blue-900">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Data Registrasi
                </CardTitle>
                <CardDescription className="text-blue-100 dark:text-blue-200">
                  Total registrasi: {registrations.length} orang
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Button
                  onClick={exportToPDF}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2 bg-white/20 text-white hover:bg-white/30 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </Button>
                <Button
                  onClick={exportToExcel}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2 bg-white/20 text-white hover:bg-white/30 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </Button>
                <Button
                  onClick={fetchRegistrations}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2 bg-white/20 text-white hover:bg-white/30 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-gray-300"></div>
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 dark:bg-blue-900">
                    <TableHead className="font-semibold text-blue-900 min-w-[50px] dark:text-gray-100">No</TableHead>
                    <TableHead className="font-semibold text-blue-900 min-w-[150px] dark:text-gray-100">Nama</TableHead>
                    <TableHead className="font-semibold text-blue-900 min-w-[150px] dark:text-gray-100">Sekolah</TableHead>
                    <TableHead className="font-semibold text-blue-900 min-w-[150px] dark:text-gray-100">Instagram</TableHead>
                    <TableHead className="font-semibold text-blue-900 min-w-[120px] dark:text-gray-100">Nomor HP</TableHead>
                    <TableHead className="font-semibold text-blue-900 min-w-[150px] dark:text-gray-100">Tanggal Daftar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration, index) => (
                    <TableRow key={registration.objectId} className="hover:bg-blue-50/50 dark:bg-gray-800 dark:hover:bg-blue-900/50">
                      <TableCell className="font-medium text-blue-900 dark:text-gray-200">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium dark:text-gray-200">
                        {registration.nama}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{registration.sekolah}</TableCell>
                      <TableCell className="text-pink-600 font-medium dark:text-pink-400">
                        {registration.instagram}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{registration.no_hp}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-700 border-blue-200 dark:text-blue-300 dark:border-blue-600 dark:bg-blue-900">
                          {new Date(registration.created).toLocaleDateString('id-ID')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {registrations.length === 0 && !isLoading && (
              <div className="text-center py-12 dark:bg-gray-800">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">Belum ada registrasi</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-blue-200 dark:border-blue-700">
          <p className="text-blue-700 font-medium dark:text-blue-300">
            Panel Admin - Tuhan memberkati pelayanan ini
          </p>
          <div className="mt-4 flex justify-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-full dark:from-yellow-500 dark:to-yellow-700">
              <Cross className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}