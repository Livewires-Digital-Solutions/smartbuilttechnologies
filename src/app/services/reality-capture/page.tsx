import {
  ServiceView,
  serviceMetadata,
} from "@/components/sections/services/ServiceView";

export const metadata = serviceMetadata("reality-capture");

export default function Page() {
  return <ServiceView slug="reality-capture" />;
}
