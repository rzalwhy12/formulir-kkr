'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Cross, Church, Phone, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';

interface FormData {
  nama: string;
  asal_gereja: string;
  nomer_hp: string;
}

export default function KKRRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    asal_gereja: '',
    nomer_hp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.asal_gereja || !formData.nomer_hp) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon isi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://shinyroad-us.backendless.app/api/data/formulir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Registrasi Berhasil!",
          description: "Terima kasih telah mendaftar untuk acara KKR",
        });
        setFormData({ nama: '', asal_gereja: '', nomer_hp: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      // FIX: Use the 'error' variable to avoid the ESLint warning
      console.error("Submission error:", error); // Log the error for debugging
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim data. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
            Formulir Registrasi KKR
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kebaktian Kebangunan Rohani - Bergabunglah dengan kami dalam ibadah yang penuh berkat
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Cross className="w-6 h-6" />
              Daftar Sekarang
            </CardTitle>
            <CardDescription className="text-blue-100">
              Isi formulir di bawah ini untuk mendaftar acara KKR
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-blue-900 font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nama Lengkap
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asal_gereja" className="text-blue-900 font-medium flex items-center gap-2">
                  <Church className="w-4 h-4" />
                  Asal Gereja
                </Label>
                <Input
                  id="asal_gereja"
                  name="asal_gereja"
                  type="text"
                  placeholder="Masukkan nama gereja Anda"
                  value={formData.asal_gereja}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomer_hp" className="text-blue-900 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Nomor HP
                </Label>
                <Input
                  id="nomer_hp"
                  name="nomer_hp"
                  type="tel"
                  placeholder="Masukkan nomor HP Anda"
                  value={formData.nomer_hp}
                  onChange={handleInputChange}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <Separator className="my-6" />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 text-lg shadow-lg transition-all duration-200"
              >
                {isSubmitting ? 'Mengirim...' : 'Daftar Sekarang'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Admin Access Link */}
        <div className="text-center mt-8">
          <Link href="/admin">
            <Button
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Shield className="w-4 h-4" />
              Akses Admin
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-blue-200">
          <p className="text-blue-700 font-medium">
            Tuhan memberkati acara KKR ini
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