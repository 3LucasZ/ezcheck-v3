import { UserProps } from "./db";
import { User } from "./next-auth";

const defaultUser: UserProps = {
  id: -100,
  email: "DNE",
  name: "DNE",
  isAdmin: false,
  image: "DNE",
  machines: [],
};

export type MachineProps = {
  id: number;
  name: string;
  description: string;
  image: string;

  lastSeen?: string;
  IP?: string;

  certificates: CertificateProps[];
  usedBy?: UserProps;
};
const defaultMachine: MachineProps = {
  id: -100,
  name: "DNE",
  description: "DNE",
  image: "DNE",
  certificates: [],
};

export type CertificateProps = {
  //defn relation
  machine: MachineProps;
  machineId: number;
  recipient: UserProps;
  recipientId: string;

  //meta
  issuer?: UserProps;
  issuerId?: string;
};

export const basicUser: User = {
  id: "",
  email: "",
  name: "",
  image: "",
  PIN: "",
  certificates: [],
  isAdmin: false,
  isSupervising: false,
};
