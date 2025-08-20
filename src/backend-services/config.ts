import { Client, Databases, Account, Storage, Users } from "node-appwrite";

interface AppwriteClients {
  account: Account;
  databases: Databases;
  storage: Storage;
  users: Users;
}

const createAdminClient = async (): Promise<AppwriteClients> => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
    .setKey(process.env.APPWRITE_API_KEY as string);

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },

    get storage() {
      return new Storage(client);
    },
    get users() {
      return new Users(client);
    },
  };
};

const createSessionClient = async (
  session?: string
): Promise<AppwriteClients> => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

  if (session) {
    client.setSession(session);
  }

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },

    get storage() {
      return new Storage(client);
    },
    get users() {
      return new Users(client);
    },
  };
};

export { createAdminClient, createSessionClient };
export type { AppwriteClients };