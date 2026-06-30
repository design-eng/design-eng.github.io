import signatureImage from '../../assets/signature.png';

export function SignatureBlock() {
  return (
    <section className="signature-block" aria-label="Closing signature">
      <div className="signature-block__copy">
        <img
          className="signature-mark"
          src={signatureImage}
          alt=""
          aria-hidden="true"
        />

        <p>Tactile Interactive, The Lab</p>
      </div>
    </section>
  );
}
