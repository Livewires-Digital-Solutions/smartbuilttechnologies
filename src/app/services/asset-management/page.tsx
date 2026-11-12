import {
  ServiceView,
  serviceMetadata,
} from "@/components/sections/services/ServiceView";

export const metadata = serviceMetadata("asset-management");

export default function Page() {
  return <ServiceView slug="asset-management" />;
}
