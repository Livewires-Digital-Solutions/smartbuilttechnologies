import {
  ServiceView,
  serviceMetadata,
} from "@/components/sections/services/ServiceView";

export const metadata = serviceMetadata("4d-simulation");

export default function Page() {
  return <ServiceView slug="4d-simulation" />;
}
