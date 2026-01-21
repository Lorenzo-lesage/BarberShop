import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Effetto sfocatura opzionale

interface Props {
    src: string;
    alt: string;
    className?: string;
}

export default function SaloonImage({ src, alt, className }: Props) {
    return (
        <LazyLoadImage
            alt={alt}
            src={src}
            effect="blur" // Può essere "blur", "opacity", o nessuno
            className={className}
            wrapperClassName={className} // Fondamentale per mantenere le dimensioni del contenitore
        />
    );
}
