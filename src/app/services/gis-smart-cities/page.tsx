import {
  ServiceView,
  serviceMetadata,
} from "@/components/sections/services/ServiceView";

export const metadata = serviceMetadata("gis-smart-cities");

export default function Page() {
  return <ServiceView slug="gis-smart-cities" />;
}
