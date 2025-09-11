'use client';

import { useState } from 'react';
import { Provider, ComparisonRequest, WiseApiComparison } from '@/types';

import { TransferForm } from '@/components/TransferForm';
import { ComparisonTable } from '@/components/ComparisonTable';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

function parseISODuration(duration: string): string {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = duration.match(regex);

  if (!matches) return duration;

  const hours = matches[1] ? `${matches[1]} hour${matches[1] !== '1' ? 's' : ''}` : '';
  const minutes = matches[2] ? `${matches[2]} minute${matches[2] !== '1' ? 's' : ''}` : '';
  const separator = hours && minutes ? ' ' : '';

  return hours + separator + minutes;
}

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];

export default function Home() {

  const [formData, setFormData] = useState<ComparisonRequest>({
    sendAmount: 100,
    sourceCurrency: 'USD',
    targetCurrency: 'EUR',
  });
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isFormInvalid = formData.sendAmount <= 0 || isNaN(formData.sendAmount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'sendAmount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. VALIDATION: Check if the amount is valid before doing anything else
    if (formData.sendAmount <= 0 || isNaN(formData.sendAmount)) {
      setError('Please enter a valid amount greater than 0.');
      return; // Stop the function execution here
    }

    if (isFormInvalid) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProviders([]);



    const params = new URLSearchParams({
      sourceCurrency: formData.sourceCurrency,
      targetCurrency: formData.targetCurrency,
      sendAmount: formData.sendAmount.toString(),
    });

    try {
      const response = await fetch(`https://api.wise.com/v4/comparisons/?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const wiseData: WiseApiComparison = await response.json();
      if (!wiseData.providers || wiseData.providers.length === 0) {
        setError('No transfer options found. Please try a different amount or currency pair.');
        setProviders([]);
      } else {
        const simplifiedProviders = wiseData.providers.map(provider => {
          const firstQuote = provider.quotes[0];
          if (!firstQuote) return null;
          let deliveryEstimate = 'Unknown';
          if (firstQuote.deliveryEstimation?.providerGivesEstimate) {
            const duration = firstQuote.deliveryEstimation.duration;
            if (duration?.min && duration?.max) {
              if (duration.min === duration.max) {
                deliveryEstimate = `Within ${parseISODuration(duration.min)}`;
              } else {
                deliveryEstimate = `${parseISODuration(duration.min)} - ${parseISODuration(duration.max)}`;
              }
            } else if (duration?.max) {
              deliveryEstimate = `By ${parseISODuration(duration.max)}`;
            } else {
              deliveryEstimate = 'N/A';
            }
          }
          return {
            name: provider.name,
            fee: firstQuote.fee,
            rate: firstQuote.rate,
            receivedAmount: firstQuote.receivedAmount,
            deliveryEstimate: deliveryEstimate,
          };
        }).filter(provider => provider !== null) as Provider[];
        setProviders(simplifiedProviders);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setError('Failed to fetch data. Please check your connection.');
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Money Transfer Comparison</h1>

        <TransferForm
          formData={formData}
          isLoading={isLoading}
          currencies={currencies}
          isDisabled={isFormInvalid}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />

        <div>
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && providers.length > 0 && (
            <ComparisonTable providers={providers} sourceCurrency={formData.sourceCurrency} />
          )}
        </div>
      </div>
    </main>
  );
}