import Image from "next/image";
import logo from "../../../public/images/logo.png";

export default function Logo({ size }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap: Record<string, number> = {
    sm: 48,
    md: 64,
    lg: 80,
  };
  const logoSize = sizeMap[size ?? "md"];
  
  return (
    <Image
      src={logo}
      alt="Logo"
      width={logoSize}
      height={logoSize}
    />
  );
}