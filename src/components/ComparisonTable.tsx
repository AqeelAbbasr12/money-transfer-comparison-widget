import { Provider } from '@/types';

interface ComparisonTableProps {
  providers: Provider[];
  sourceCurrency: string; // Needed to display the currency code next to the fee
}

export const ComparisonTable = ({ providers, sourceCurrency }: ComparisonTableProps) => {
  if (providers.length === 0) {
    return null; // Or you could return a placeholder message like <p>No data to display.</p>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Comparison Results</h2>
      <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Provider</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Fee</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Rate</th>
              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Arrival Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {providers.map((provider, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{provider.name}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{provider.fee} {sourceCurrency}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{provider.rate}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{provider.deliveryEstimate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};