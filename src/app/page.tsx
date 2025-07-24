'use client';

import { useState } from 'react';
import Image from 'next/image'; // Import komponen Image dari next/image
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Instagram, Phone, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';

interface FormData {
  nama: string;
  sekolah: string;
  instagram: string;
  no_hp: string;
}

export default function KKRRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    sekolah: '',
    instagram: '',
    no_hp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.sekolah || !formData.instagram || !formData.no_hp) {
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
        setFormData({ nama: '', sekolah: '', instagram: '', no_hp: '' });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error("Submission error:", error); 
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
    // Body Background for luxurious dark mode
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className='mt-8'>
              {/* Mengganti ikon Cross dengan logo KPRPPI */}
              <Image 
                src="/logo-kprppi.png" 
                alt="Logo KPRPPI" 
                width={100} // Sesuaikan lebar sesuai kebutuhan
                height={100} // Sesuaikan tinggi sesuai kebutuhan
                className="object-contain" // Menjaga aspek rasio dan mengisi area
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4 dark:text-gray-100">
            Formulir Registrasi KKR
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            Konfirmasi Kehadiran “Praise and  Worship Night Pemuda Remaja”
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-yellow-600 rounded-full dark:from-purple-600 dark:to-yellow-700"></div>
          </div>
        </div>

        {/* Main Content with Responsive Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Photo - Mobile: Above form, Desktop: Left side */}
            <div className="order-1 lg:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-yellow-100 dark:from-blue-900 dark:to-gray-800">
                <img
                  src="/kkr1.JPG"
                  alt="KKR Event"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Form - Mobile: Below photo, Desktop: Right side */}
            <div className="order-2 lg:order-2">
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur dark:bg-gray-800/90 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg dark:from-blue-800 dark:to-blue-900">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {/* Dark mode for icon in title, if it were an SVG/component */}
                    Daftar Sekarang
                  </CardTitle>
                  <CardDescription className="text-blue-100 dark:text-blue-200">
                    Isi formulir di bawah ini untuk Konfirmasi Kehadiran
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nama" className="text-blue-900 font-medium flex items-center gap-2 dark:text-gray-200">
                        <User className="w-4 h-4 dark:text-gray-400" />
                        Nama Lengkap
                      </Label>
                      <Input
                        id="nama"
                        name="nama"
                        type="text"
                        placeholder="Masukkan nama lengkap Anda"
                        value={formData.nama}
                        onChange={handleInputChange}
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sekolah" className="text-blue-900 font-medium flex items-center gap-2 dark:text-gray-200">
                        <GraduationCap className="w-4 h-4 dark:text-gray-400" />
                        Sekolah
                      </Label>
                      <Input
                        id="sekolah"
                        name="sekolah"
                        type="text"
                        placeholder="Masukkan nama sekolah Anda"
                        value={formData.sekolah}
                        onChange={handleInputChange}
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-blue-900 font-medium flex items-center gap-2 dark:text-gray-200">
                        <Instagram className="w-4 h-4 dark:text-gray-400" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        type="text"
                        placeholder="@username_instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="no_hp" className="text-blue-900 font-medium flex items-center gap-2 dark:text-gray-200">
                        <Phone className="w-4 h-4 dark:text-gray-400" />
                        Nomor HP
                      </Label>
                      <Input
                        id="no_hp"
                        name="no_hp"
                        type="tel"
                        placeholder="Masukkan nomor HP Anda"
                        value={formData.no_hp}
                        onChange={handleInputChange}
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        required
                      />
                    </div>

                    <Separator className="my-6 dark:bg-gray-700" />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 text-lg shadow-lg transition-all duration-200 dark:from-yellow-600 dark:to-yellow-700 dark:hover:from-yellow-700 dark:hover:to-yellow-800"
                    >
                      {isSubmitting ? 'Mengirim...' : 'Daftar Sekarang'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Admin Access Link */}
        <div className="text-center mt-8">
          <Link href="/admin">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50"
            >
              <Shield className="w-4 h-4 dark:text-blue-400" />
              Akses Admin
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-blue-200 dark:border-blue-700">
          <p className="text-blue-700 font-medium dark:text-blue-300">
            Tuhan memberkati acara KKR ini
          </p>
          <div className="mt-4 flex justify-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-full dark:from-yellow-500 dark:to-yellow-700">
              {/* Mengganti ikon Cross dengan logo KPRPPI di footer */}
              <Image 
                src="/logo-kprppi.png" 
                alt="Logo KPRPPI" 
                width={70} // Sesuaikan lebar sesuai kebutuhan
                height={70} // Sesuaikan tinggi sesuai kebutuhan
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}