import {
  ServiceView,
  serviceMetadata,
} from "@/components/sections/services/ServiceView";

export const metadata = serviceMetadata("bim");

export default function Page() {
  return <ServiceView slug="bim" />;
}
