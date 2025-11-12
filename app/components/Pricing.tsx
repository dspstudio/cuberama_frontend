import React, { useMemo } from 'react';
import FadeInSection from './FadeInSection';
import { CheckCircle2, Star } from 'lucide-react';
import { useAuthUI } from '@/app/contexts/AuthUIContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import {
  PRICING_PLANS_USD,
  PRICING_PLANS_EUR,
  PricingPlan
} from '@/app/constants';
import Tooltip from './Tooltip';
import {
  cuberama3DAppLink
} from '@/app/constants';
const Pricing: React.FC = () => {
  const { currency } = useCurrency();

  const handleCTAClick = (plan: PricingPlan) => {
    if (plan.name === 'Freemium') {
      // For the free plan, either launch the app if logged in, or show the login/signup popover.
      window.open(cuberama3DAppLink, '_blank');
    } else {
      // For the Pro plan, direct the user to the Stripe checkout to start their trial.
      window.open(plan.stripeLink, '_blank');
    }
  };

  const plans = useMemo(() => {
    return currency === 'EUR' ? PRICING_PLANS_EUR : PRICING_PLANS_USD;
  }, [currency]);


  return (
    <section id="pricing" className="py-20 sm:py-32">
      <div className="container mx-auto px-6">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-gray-400">
              Simple, transparent pricing for every creator. Start for free and upgrade when you&apos;re ready.
            </p>
          </div>
        </FadeInSection>

        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan) => (
            <FadeInSection key={plan.name}>
              <div
                className={`h-full flex flex-col bg-slate-900/50 border rounded-xl p-8 transform transition-transform duration-300 hover:-translate-y-2 ${
                  plan.isPopular ? 'border-yellow-400 shadow-2xl shadow-yellow-500/20 relative' : 'border-white/10'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 text-[11px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 whitespace-nowrap">
                    <Star className="w-4 h-4" />
                    Limited Time Offer
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-4 text-gray-400 min-h-[4rem]">{plan.description}</p>
                  <div className="mt-6">
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-extrabold text-white">{plan.price}</span>
                        {plan.originalPrice && (
                            <span className="text-xl md:text-2xl font-normal text-gray-500 line-through">{plan.originalPrice}</span>
                        )}
                    </div>
                    {plan.billingCycle && (
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-gray-400">
                                {(() => {
                                    const highlightText = 'one-time payment';
                                    const parts = plan.billingCycle.split(highlightText);
                                    if (parts.length > 1) {
                                        return (
                                            <>
                                                {parts[0]}
                                                <strong className="text-white font-semibold">{highlightText}</strong>
                                                {parts[1]}
                                            </>
                                        );
                                    }
                                    return plan.billingCycle;
                                })()}
                            </span>
                        </div>
                    )}
                  </div>
                  <ul className="mt-8 space-y-4 text-gray-300">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        {feature.tooltip ? (
                          <Tooltip text={feature.tooltip} position="top" align="start">
                            <span className="border-b border-dashed border-gray-500 cursor-help">{feature.text}</span>
                          </Tooltip>
                        ) : (
                          <span>{feature.text}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10">
                  <button
                    onClick={() => handleCTAClick(plan)}
                    className={`w-full px-5 py-3 text-sm font-semibold rounded-lg shadow-lg transform transition-all duration-300 ${
                      plan.isPopular
                        ? 'text-white bg-gradient-to-r from-blue-700 to-cyan-800 hover:scale-105 hover:from-blue-600 hover:to-cyan-700'
                        : 'text-white bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {plan.cta}
                  </button>
                  {plan.name === 'Pro' && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Secure payment via Stripe. Lifetime access after trial.
                    </p>
                  )}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;