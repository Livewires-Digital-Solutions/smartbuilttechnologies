import {
  ServiceView,
  serviceMetadata,
} from "@/components/sections/services/ServiceView";

export const metadata = serviceMetadata("it-services");

export default function Page() {
  return <ServiceView slug="it-services" />;
}
