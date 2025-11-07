/**
 * Client-side only emergency alert page
 * No backend required - works 100% offline
 */

'use client';

import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useClientAlert } from '@/hooks/useClientAlert';
import { getPrimaryContacts, type StoredContact } from '@/lib/contacts-storage';

export default function ClientAlertPage() {
  const { coordinates, error: locationError, loading: locationLoading, refreshLocation } = useGeolocation(true);
  const { sendAlert, loading: sendingAlert, error: alertError, success } = useClientAlert();
  const [contacts, setContacts] = useState<StoredContact[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Load contacts on mount
  useEffect(() => {
    const loadedContacts = getPrimaryContacts();
    setContacts(loadedContacts);
    
    // Show settings if no contacts configured
    if (loadedContacts.length === 0) {
      setShowSettings(true);
    }
  }, []);

  const handleEmergency = async () => {
    if (!coordinates) {
      alert('Aguarde... obtendo sua localização');
      return;
    }

    if (contacts.length === 0) {
      alert('Configure pelo menos um contato de emergência primeiro');
      setShowSettings(true);
      return;
    }

    const confirmed = confirm(
      `🚨 CONFIRMAR ALERTA DE EMERGÊNCIA?\n\nSerá enviado para ${contacts.length} contato(s):\n${contacts.map(c => `• ${c.name}`).join('\n')}`
    );

    if (confirmed) {
      await sendAlert(coordinates);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-4">
      {/* Header */}
      <div className="max-w-md mx-auto pt-6 pb-4">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          🚨 SafeAlert
        </h1>
        <p className="text-white/80 text-center text-sm">
          Sistema de Alerta de Emergência
        </p>
        <p className="text-white/60 text-center text-xs mt-1">
          ✨ Funciona 100% offline
        </p>
      </div>

      {/* Status Card */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          {/* Location Status */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/90 text-sm font-medium">
              📍 Localização
            </span>
            {locationLoading && (
              <span className="text-white/70 text-sm animate-pulse">
                Obtendo...
              </span>
            )}
            {coordinates && (
              <span className="text-green-300 text-sm">
                ✓ Pronta
              </span>
            )}
            {locationError && (
              <button
                onClick={refreshLocation}
                className="text-yellow-300 text-sm hover:text-yellow-200"
              >
                ⟳ Tentar novamente
              </button>
            )}
          </div>

          {/* Contacts Status */}
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-sm font-medium">
              👥 Contatos
            </span>
            <span className={`text-sm ${contacts.length > 0 ? 'text-green-300' : 'text-yellow-300'}`}>
              {contacts.length === 0 ? '⚠ Nenhum configurado' : `✓ ${contacts.length} ativo(s)`}
            </span>
          </div>

          {/* Contacts List */}
          {contacts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/20">
              {contacts.map(contact => (
                <div key={contact.id} className="text-white/70 text-xs mb-1">
                  • {contact.name} - {contact.method === 'both' ? '📱 SMS & WhatsApp' : contact.method === 'whatsapp' ? '💬 WhatsApp' : '📱 SMS'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Button */}
      <div className="max-w-md mx-auto mb-6">
        <button
          onClick={handleEmergency}
          disabled={sendingAlert || !coordinates}
          className={`
            w-full h-48 rounded-3xl font-bold text-3xl
            transition-all duration-200 transform
            ${sendingAlert || !coordinates
              ? 'bg-gray-400 cursor-not-allowed scale-95'
              : 'bg-white text-red-600 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl'
            }
            ${!sendingAlert && coordinates ? 'animate-pulse-slow' : ''}
          `}
        >
          {sendingAlert ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin text-4xl">⏳</div>
              <div className="text-lg">Enviando...</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-6xl">🚨</div>
              <div>EMERGÊNCIA</div>
              <div className="text-sm font-normal opacity-70">
                Toque para alertar
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-green-500 text-white rounded-2xl p-4 text-center animate-fade-in">
            <div className="text-4xl mb-2">✅</div>
            <div className="font-bold mb-1">Alerta Enviado!</div>
            <div className="text-sm opacity-90">
              Seus contatos foram notificados
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {(alertError || locationError) && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-yellow-500 text-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="font-bold mb-1">Atenção</div>
            <div className="text-sm opacity-90">
              {alertError || locationError?.message}
            </div>
          </div>
        </div>
      )}

      {/* Settings Button */}
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full bg-white/10 backdrop-blur-lg text-white rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
        >
          ⚙️ Configurações de Contatos
        </button>
      </div>

      {/* Settings Panel (Simple) */}
      {showSettings && (
        <div className="max-w-md mx-auto mt-6 bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">👥 Gerenciar Contatos</h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-sm text-blue-900">
              <strong>📱 Como funciona:</strong><br/>
              Esta versão abre o app de SMS ou WhatsApp do seu celular automaticamente.
              Não precisa de servidor ou internet!
            </p>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p className="mb-2">Para adicionar contatos:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Abra o Console do navegador (F12)</li>
              <li>Cole o código abaixo:</li>
            </ol>
          </div>

          <div className="bg-gray-100 rounded-lg p-3 mb-4 font-mono text-xs overflow-x-auto">
{`import { saveContact } from '@/lib/contacts-storage';

saveContact({
  name: 'Nome do Contato',
  phone: '+5511999999999',
  method: 'both', // 'sms', 'whatsapp', ou 'both'
  isPrimary: true
});`}
          </div>

          <div className="text-xs text-gray-500 mb-4">
            <p>Ou crie uma página de configurações completa!</p>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg p-3 font-medium transition-all"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Info Footer */}
      <div className="max-w-md mx-auto mt-8 text-center text-white/60 text-xs space-y-1">
        <p>✨ Sem backend • 🔒 100% privado • 📱 Funciona offline</p>
        <p>Os dados ficam salvos apenas no seu dispositivo</p>
      </div>
    </div>
  );
}
