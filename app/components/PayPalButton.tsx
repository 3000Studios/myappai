export default function PayPalButton() {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black/50 border border-yellow-500/30 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-white">PayPal Donation</h3>
      <iframe
        src="https://www.paypal.com/donate/buttons/YOUR_BUTTON_ID"
        className="w-full h-32 border-none"
        title="PayPal Donate"
      />
    </div>
  );
}

