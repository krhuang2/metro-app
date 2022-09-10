import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import styles from './HeroSection.module.scss';

interface IHeroSectionProps {
    title: string;
    image: StaticImageData;
    imageAlt?: string;
}
export default function HeroSection({title, image, imageAlt}: IHeroSectionProps) {

  return (
    <section className={styles.heroSection}>
      <h1 className={styles.heroTitle}>{title}</h1>
      {image && imageAlt &&
        <div className={styles.heroImage}><Image src={image} alt={imageAlt} /></div>
      }
      <div className={styles.selectRouteLinks}>
        <Link href={'/'}><a className={styles.selectRouteLink}>Home</a></Link>
        <Link href={'/find-by-route'}><a className={styles.selectRouteLink}>Find By Route</a></Link>
        <Link href={'/find-by-route'}><a className={styles.selectRouteLink}>Find By Stop Number</a></Link>
      </div>
    </section>
  );
        
        
}