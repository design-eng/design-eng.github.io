import signatureDarkImage from '../../assets/signature-dark.png';
import signatureImage from '../../assets/signature.png';

type SignatureBlockProps = {
  theme?: 'light' | 'dark';
};

export function SignatureBlock({
  theme = 'light'
}: SignatureBlockProps) {
  return (
    <section className="signature-block" aria-label="Closing signature">
      <div className="signature-block__copy">
        <img
          className="signature-mark"
          src={theme === 'dark' ? signatureDarkImage : signatureImage}
          alt=""
          aria-hidden="true"
        />

        <p>Tactile Interactive, The Lab</p>
      </div>
    </section>
  );
}
