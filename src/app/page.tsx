'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ArrowRight, Camera, CheckCircle2, Info, ShieldCheck, UploadCloud } from 'lucide-react';

type IntentFormState = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  countryOfCitizenship: string;
  email: string;
  phone: string;
};

const MAX_SELFIE_BYTES = 5 * 1024 * 1024; // 5MB

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<IntentFormState>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    countryOfCitizenship: '',
    email: '',
    phone: '',
  });
  const [selfie, setSelfie] = useState<File | null>(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!selfie) {
      setSelfiePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selfie);
    setSelfiePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selfie]);

  const isValid = useMemo(() => {
    return (
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.dateOfBirth.trim().length > 0 &&
      form.countryOfCitizenship.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.phone.trim().length > 0 &&
      !!selfie
    );
  }, [form, selfie]);

  const onChange = (key: keyof IntentFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setSelfie(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('A selfie precisa ser uma imagem (JPG/PNG/WebP).');
      setSelfie(null);
      return;
    }
    if (file.size > MAX_SELFIE_BYTES) {
      setError('A selfie é muito grande. Envie uma imagem com menos de 5MB.');
      setSelfie(null);
      return;
    }
    setError(null);
    setSelfie(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setConfirmationId(null);

    if (!isValid || !selfie) {
      setError('Preencha todos os campos obrigatórios e envie uma selfie nítida.');
      return;
    }

    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.set('firstName', form.firstName.trim());
      body.set('middleName', form.middleName.trim());
      body.set('lastName', form.lastName.trim());
      body.set('dateOfBirth', form.dateOfBirth);
      body.set('countryOfCitizenship', form.countryOfCitizenship.trim());
      body.set('email', form.email.trim());
      body.set('phone', form.phone.trim());
      body.set('selfie', selfie);

      const res = await fetch('/api/departure-intent', { method: 'POST', body });
      const json = (await res.json()) as { ok?: boolean; confirmationId?: string; error?: string };
      if (!res.ok || !json.ok || !json.confirmationId) {
        throw new Error(json.error || 'Falha ao enviar. Tente novamente.');
      }

      setConfirmationId(json.confirmationId);
      setForm({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        countryOfCitizenship: '',
        email: '',
        phone: '',
      });
      setSelfie(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 text-sm font-bold mb-6 shadow-lg">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Ajuda para “Intenção de Partida” • Possível recompensa de até US$ 1.000
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              CBP Home — “Intenção de Partida”
              <span className="text-gradient block mt-1">Tudo o que pedem, em um só lugar.</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Preencha os dados solicitados no app móvel CBP Home ao enviar uma Intenção de Partida e depois envie uma selfie nítida.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: info panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="card-premium p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-lg">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">O que você vai precisar</h2>
                    <p className="text-gray-600 mt-1">
                      Ao enviar uma Intenção de Partida pelo app CBP Home, será solicitado:
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-gray-800">
                  {[
                    'Primeiro nome',
                    'Nome do meio',
                    'Sobrenome',
                    'Data de nascimento',
                    'País de cidadania',
                    'Endereço de e-mail',
                    'Número de telefone',
                    'Uma foto nítida (selfie)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-amber-900" />
                  </div>
                  <div>
                    <div className="font-bold text-amber-950">Não é um site oficial do governo</div>
                    <div className="text-sm text-amber-900 mt-1">
                      Esta página é um assistente independente. Não é afiliada ao CBP. A elegibilidade para recompensa (incluindo “até US$ 1.000”) depende de regras externas e não é garantida aqui.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div id="form" className="lg:col-span-7 card-silver p-6 sm:p-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Preencha suas informações</h2>
                  <p className="text-gray-600 mt-1">Campos com * são obrigatórios.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <Camera className="w-4 h-4" />
                  <span>Selfie obrigatória</span>
                </div>
              </div>

              {confirmationId && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Enviado com sucesso
                  </div>
                  <div className="text-sm mt-1">
                    ID de confirmação: <span className="font-mono font-semibold">{confirmationId}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
                  <div className="font-semibold">Ajuste para continuar</div>
                  <div className="text-sm mt-1">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Primeiro nome *</label>
                    <input
                      value={form.firstName}
                      onChange={onChange('firstName')}
                      autoComplete="given-name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Primeiro nome"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Nome do meio</label>
                    <input
                      value={form.middleName}
                      onChange={onChange('middleName')}
                      autoComplete="additional-name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome do meio (opcional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Sobrenome *</label>
                    <input
                      value={form.lastName}
                      onChange={onChange('lastName')}
                      autoComplete="family-name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sobrenome"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Data de nascimento *</label>
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={onChange('dateOfBirth')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">País de cidadania *</label>
                    <input
                      value={form.countryOfCitizenship}
                      onChange={onChange('countryOfCitizenship')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="País de cidadania"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">E-mail *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={onChange('email')}
                      autoComplete="email"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="seuemail@exemplo.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Telefone *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={onChange('phone')}
                      autoComplete="tel"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 555 123 4567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Uma selfie nítida *</label>
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-5">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-lg">
                          <UploadCloud className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Enviar selfie nítida</div>
                          <div className="text-sm text-gray-600">JPG/PNG/WebP, até 5MB</div>
                        </div>
                      </div>

                      <div className="md:ml-auto flex items-center gap-3">
                        <label className="btn btn-outline cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSelfieChange}
                            className="hidden"
                            required={!selfie}
                          />
                          Escolher arquivo
                        </label>
                        {selfie && (
                          <button
                            type="button"
                            onClick={() => setSelfie(null)}
                            className="btn btn-secondary"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>

                    {selfiePreviewUrl && (
                      <div className="mt-5">
                        <div className="text-sm font-semibold text-gray-800 mb-2">Pré-visualização</div>
                        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selfiePreviewUrl}
                            alt="Pré-visualização da selfie"
                            className="w-full max-h-[360px] object-contain bg-gray-50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Enviando…' : 'Enviar intenção'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="text-sm text-gray-600">
                    Ao enviar, você confirma que as informações são corretas e que a selfie está nítida e identificável.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
