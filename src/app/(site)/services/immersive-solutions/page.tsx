import {
  ServiceView,
  serviceMetadata,
} from "@/components/sections/services/ServiceView";

export const metadata = serviceMetadata("immersive-solutions");

export default function Page() {
  return <ServiceView slug="immersive-solutions" />;
}
