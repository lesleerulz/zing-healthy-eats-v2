import { Settings2, Save, Store, CreditCard, MapPin } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-[#D4A373]" />
          Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Configure your store preferences and integrations.</p>
      </div>

      <div className="space-y-6">
        {/* General Store Info */}
        <section className="bg-[#1A1A23] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg text-[#D4A373]">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">General Information</h2>
              <p className="text-sm text-gray-400">Basic details about your store.</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Store Name</label>
                <input 
                  type="text" 
                  defaultValue="Zing Healthy Treats"
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Support Phone</label>
                <input 
                  type="text" 
                  defaultValue="+254 700 000 000"
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@zinghealthyeats.com"
                className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Payment Config */}
        <section className="bg-[#1A1A23] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg text-[#D4A373]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Payment Integrations</h2>
              <p className="text-sm text-gray-400">Configure your payment gateways.</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium text-white">M-Pesa Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Consumer Key</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Consumer Secret</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Passkey</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Shortcode</label>
                  <input 
                    type="text" 
                    placeholder="174379"
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-md font-medium text-white">Paystack Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Public Key</label>
                  <input 
                    type="text" 
                    placeholder="pk_test_..."
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Secret Key</label>
                  <input 
                    type="password" 
                    placeholder="sk_test_..."
                    className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Zones */}
        <section className="bg-[#1A1A23] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg text-[#D4A373]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Delivery Zones</h2>
              <p className="text-sm text-gray-400">Manage base delivery fees.</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-gray-300">Base Delivery Fee ($)</label>
                <input 
                  type="number" 
                  defaultValue="5.00"
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-gray-300">Free Delivery Threshold ($)</label>
                <input 
                  type="number" 
                  defaultValue="50.00"
                  className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button className="bg-[#D4A373] text-black hover:bg-[#D4A373]/90 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
