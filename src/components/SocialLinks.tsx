import { Facebook, Instagram, Youtube } from 'lucide-react';

export const SOCIAL_LINKS = [
  { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61572504539153', Icon: Facebook },
  { label: 'Instagram', url: 'https://www.instagram.com/radiozigomarfm', Icon: Instagram },
  { label: 'Youtube', url: 'https://www.youtube.com/@radiozigomar', Icon: Youtube },
];

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map(({ label, url, Icon }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all hover:scale-110"
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}
