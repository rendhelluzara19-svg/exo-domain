export const Logo = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className={`inline-block align-middle ${className}`}>
    <rect width="500" height="500" rx="120" fill="#FDFBF7"/>
    <rect x="20" y="20" width="460" height="460" rx="100" fill="none" stroke="#E5E7EB" strokeWidth="2"/>
    <circle cx="250" cy="250" r="175" fill="none" stroke="#C5A059" strokeWidth="4" strokeDasharray="12 6" />
    <circle cx="250" cy="250" r="150" fill="#15241C" />
    <g transform="translate(0, -5)">
      <path d="M230,150 Q210,120 180,110" fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round"/>
      <path d="M270,150 Q290,120 320,110" fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round"/>
      <path d="M220,160 C220,145 280,145 280,160 L290,185 C290,190 210,190 210,185 Z" fill="#F1C40F" />
      <path d="M205,195 C205,195 250,190 295,195 C310,220 310,250 295,280 C275,290 225,290 205,280 C190,250 190,220 205,195 Z" fill="#D4AF37" opacity="0.95"/>
      <path d="M210,195 C180,220 175,290 250,370 C250,370 230,290 210,195 Z" fill="#C5A059" stroke="#15241C" strokeWidth="2"/>
      <path d="M290,195 C320,220 325,290 250,370 C250,370 270,290 290,195 Z" fill="#C5A059" stroke="#15241C" strokeWidth="2"/>
      <line x1="215" y1="225" x2="285" y2="225" stroke="#15241C" strokeWidth="3" strokeLinecap="round"/>
      <line x1="210" y1="255" x2="290" y2="255" stroke="#15241C" strokeWidth="3" strokeLinecap="round"/>
      <line x1="215" y1="285" x2="285" y2="285" stroke="#15241C" strokeWidth="3" strokeLinecap="round"/>
      <polygon points="250,220 262,240 250,260 238,240" fill="#FFFFFF" opacity="0.9"/>
    </g>
    <circle cx="250" cy="400" r="6" fill="#F1C40F"/>
    <circle cx="225" cy="395" r="4" fill="#C5A059"/>
    <circle cx="275" cy="395" r="4" fill="#C5A059"/>
  </svg>
);
