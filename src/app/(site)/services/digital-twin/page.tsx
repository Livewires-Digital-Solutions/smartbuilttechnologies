import {
  ServiceView,
  serviceMetadata,
} from "@/components/sections/services/ServiceView";

export const metadata = serviceMetadata("digital-twin");

export default function Page() {
  return <ServiceView slug="digital-twin" />;
}
