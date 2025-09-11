import { ComparisonRequest } from '@/types';

interface TransferFormProps {
  formData: ComparisonRequest;
  isLoading: boolean;
  currencies: string[];
  isDisabled: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TransferForm = ({ formData, isLoading, currencies, isDisabled, onInputChange, onSubmit }: TransferFormProps) => {
  return (
    <form onSubmit={onSubmit} className="mb-8 space-y-4 text-gray-700 md:space-y-0 md:grid md:grid-cols-12 md:gap-4">
      <div className="md:col-span-3">
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Amount to Send
        </label>
        <input
          type="number"
          id="sendAmount"
          name="sendAmount"
          value={formData.sendAmount}
          onChange={onInputChange}
          className="w-full h-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 1000"
          required
        />
      </div>

      <div className="md:col-span-3">
        <label htmlFor="sourceCurrency" className="block text-sm font-medium mb-1">
          From Currency
        </label>
        <select
          id="sourceCurrency"
          name="sourceCurrency"
          value={formData.sourceCurrency}
          onChange={onInputChange}
          className="w-full h-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {currencies.map(currency => (
            <option key={`src-${currency}`} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-3">
        <label htmlFor="targetCurrency" className="block text-sm font-medium mb-1">
          To Currency
        </label>
        <select
          id="targetCurrency"
          name="targetCurrency"
          value={formData.targetCurrency}
          onChange={onInputChange}
          className="w-full h-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          {currencies.map(currency => (
            <option key={`target-${currency}`} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-3 flex items-end">
        <button
          type="submit"
          disabled={isLoading || isDisabled}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? 'Comparing...' : 'Compare'}
        </button>
      </div>
    </form>
  );
};