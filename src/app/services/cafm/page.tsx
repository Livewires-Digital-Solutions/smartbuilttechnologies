import {
  ServiceView,
  serviceMetadata,
} from "@/components/sections/services/ServiceView";

export const metadata = serviceMetadata("cafm");

export default function Page() {
  return <ServiceView slug="cafm" />;
}
