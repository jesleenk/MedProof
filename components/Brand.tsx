import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="MedProof home">
      <span className="brand-mark" aria-hidden="true"><i /><i /></span>
      <span>MedProof</span>
    </Link>
  );
}
