"use client";

import { Lock } from "lucide-react";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import svgPaths from "../../imports/svg-dy16vubapd";

export interface ICPData {
  persona_name: string;
  age_range?: string;
  bio: string;
  goals: string[];
  pain_points: string[];
  buying_triggers: string[];
  behaviours?: string[];
  affinities?: string[];
  messaging?: string[];
  conversion_drivers?: string[];
  content_pillars?: string[];
  meta_lookalike?: string;
  avatar: string;
  circleColor: string;
}

interface ICPCardProps {
  data: ICPData;
  isLocked?: boolean;
  onUnlock?: () => void;
  cardNumber?: number;
  onEmailICP?: () => void;
}

export function ICPCard({ data, isLocked = false, onUnlock, cardNumber, onEmailICP }: ICPCardProps) {
  const LockedSection = ({ title }: { title: string }) => (
    <div className="relative">
      <div className="select-none pointer-events-none opacity-40">
        <h3 className="font-['Fraunces'] mb-3">{title}</h3>
        <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
          <li>• Sample placeholder text here</li>
          <li>• Additional content appears here</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-md mx-auto opacity-0 animate-fade-in-up">
      {/* Card Number Badge - Top Corner, Outside Card - Left for card 1, Right for others */}
      {cardNumber && (
        <div 
          className={`absolute -top-4 w-12 h-12 text-background rounded-full flex items-center justify-center border-2 border-black z-20 shadow-md ${
            cardNumber === 1 ? 'left-2 sm:-left-4' : 'right-2 sm:-right-4'
          }`}
          style={{ backgroundColor: data.circleColor }}
        >
          <span className="font-['Fraunces'] text-xl text-black">{cardNumber}</span>
        </div>
      )}

      {/* Profile Circle - positioned at top center, half outside */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-24 h-24 z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 146 145" fill="none">
          <path 
            d={svgPaths.pef38d80} 
            fill={data.circleColor} 
            stroke="black" 
            strokeWidth="1"
          />
        </svg>
        <ImageWithFallback 
          src={data.avatar} 
          alt={data.persona_name} 
          className="absolute inset-0 w-full h-full object-cover rounded-full p-1.5"
        />
      </div>

      {/* Card Container */}
      <div className="bg-background border border-black rounded-[10px] p-6 pt-16 shadow-lg">
        {/* Header */}
        <div className="text-center mb-6 pb-6 border-b border-warm-grey">
          <h2 className="font-['Fraunces'] mb-2">{data.persona_name}</h2>
          {data.age_range && (
            <p className="font-['Inter'] text-sm text-foreground/60 mb-2">{data.age_range}</p>
          )}
          <p className="font-['Inter'] text-[15px] text-foreground/70 italic">{data.bio}</p>
        </div>

        {/* Free Sections */}
        <div className="space-y-6">
          {/* Show all free content for unlocked card (card 1) */}
          {!isLocked && (
            <>
              {/* Goals & Motivations */}
              <div>
                <h3 className="font-['Fraunces'] mb-3">Goals & Motivations</h3>
                <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                  {data.goals.map((goal, index) => (
                    <li key={index}>• {goal}</li>
                  ))}
                </ul>
              </div>

              {/* Pain Points */}
              <div>
                <h3 className="font-['Fraunces'] mb-3">Pain Points</h3>
                <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                  {data.pain_points.map((point, index) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
              </div>

              {/* Buying Triggers */}
              <div>
                <h3 className="font-['Fraunces'] mb-3">Buying Triggers</h3>
                <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                  {data.buying_triggers.map((trigger, index) => (
                    <li key={index}>• {trigger}</li>
                  ))}
                </ul>
              </div>

              {/* Email ICP CTA - Above the divider for first card */}
              {onEmailICP && cardNumber === 1 && (
                <div className="pt-2">
                  <Button
                    onClick={onEmailICP}
                    variant="outline"
                    className="w-full bg-transparent text-foreground border border-black rounded-[10px] py-6 transition-all hover:scale-[1.02] hover:bg-accent-grey/20"
                  >
                    Email me this ICP
                  </Button>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-warm-grey pt-6"></div>
            </>
          )}

          {/* Locked Card - Show unlock button above blurred content */}
          {isLocked && (
            <>
              {/* Unlock CTA at top */}
              {onUnlock && (
                <div className="pb-6">
                  <Button
                    onClick={onUnlock}
                    className="w-full bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] py-6 transition-all hover:scale-[1.02] hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Unlock Full ICP
                  </Button>
                </div>
              )}

              {/* Blurred content preview */}
              <div className="blur-[4px] opacity-50 select-none pointer-events-none space-y-6">
                {/* Goals & Motivations */}
                <div>
                  <h3 className="font-['Fraunces'] mb-3">Goals & Motivations</h3>
                  <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                    {data.goals.map((goal, index) => (
                      <li key={index}>• {goal}</li>
                    ))}
                  </ul>
                </div>

                {/* Pain Points */}
                <div>
                  <h3 className="font-['Fraunces'] mb-3">Pain Points</h3>
                  <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                    {data.pain_points.map((point, index) => (
                      <li key={index}>• {point}</li>
                    ))}
                  </ul>
                </div>

                {/* Buying Triggers */}
                <div>
                  <h3 className="font-['Fraunces'] mb-3">Buying Triggers</h3>
                  <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                    {data.buying_triggers.map((trigger, index) => (
                      <li key={index}>• {trigger}</li>
                    ))}
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-warm-grey pt-6"></div>

                {/* Additional locked sections placeholder */}
                <div>
                  <h3 className="font-['Fraunces'] mb-3">Behaviour & Online Habits</h3>
                  <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                    <li>• Active on social platforms daily</li>
                    <li>• Reads industry blogs and newsletters</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-['Fraunces'] mb-3">Brand Affinities</h3>
                  <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                    <li>• Popular industry tools and platforms</li>
                    <li>• Follows thought leaders</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-['Fraunces'] mb-3">Messaging That Resonates</h3>
                  <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                    <li>• Value-driven language</li>
                    <li>• Results-focused messaging</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Unlocked sections for card 1 */}
          {!isLocked && (
            <>
              {/* Unlocked Sections - Show headlines clearly, blur content */}
              {data.behaviours && (
                <div>
                  <h3 className="font-['Fraunces'] mb-3">Behaviour & Online Habits</h3>
                  <div className="blur-sm select-none pointer-events-none">
                    <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                      {data.behaviours.map((behaviour, index) => (
                        <li key={index}>• {behaviour}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {data.affinities && (
                <div>
                  <h3 className="font-['Fraunces'] mb-3">Brand Affinities</h3>
                  <div className="blur-sm select-none pointer-events-none">
                    <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                      {data.affinities.map((affinity, index) => (
                        <li key={index}>• {affinity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Unlock Full ICP CTA - After Brand Affinities */}
              {onUnlock && cardNumber === 1 && (
                <div className="pt-2">
                  <Button
                    onClick={onUnlock}
                    className="w-full bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] py-6 transition-all hover:scale-[1.02] hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Unlock Full ICP
                  </Button>
                </div>
              )}

              {data.messaging && (
                <div>
                  <h3 className="font-['Fraunces'] mb-3">Messaging That Resonates</h3>
                  <div className="blur-sm select-none pointer-events-none">
                    <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                      {data.messaging.map((message, index) => (
                        <li key={index}>• {message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {data.conversion_drivers && (
                <div>
                  <h3 className="font-['Fraunces'] mb-3">What Converts Them</h3>
                  <div className="blur-sm select-none pointer-events-none">
                    <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                      {data.conversion_drivers.map((driver, index) => (
                        <li key={index}>• {driver}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {data.content_pillars && (
                <div>
                  <h3 className="font-['Fraunces'] mb-3">Content Pillars</h3>
                  <div className="blur-sm select-none pointer-events-none">
                    <ul className="space-y-2 font-['Inter'] text-[15px] text-foreground/80">
                      {data.content_pillars.map((pillar, index) => (
                        <li key={index}>• {pillar}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {data.meta_lookalike && (
                <div>
                  <h3 className="font-['Fraunces'] mb-3">Meta Lookalike Audience</h3>
                  <div className="blur-sm select-none pointer-events-none">
                    <p className="font-['Inter'] text-[15px] text-foreground/80">{data.meta_lookalike}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

