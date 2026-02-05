export type ChatMember = {
  id: string;
  userId: string;
};

export type Chat = {
  id: string;
  name: string;
  avatar?: string | null;
  lastMessage?: string;
  type?: "PRIVATE" | "GROUP";
  members?: ChatMember[];
};

export type Message = {
  id: string;
  text: string;
  time: string;
  fromMe: boolean;
  conversationId: string;
};

export type FriendRequest = {
  id: string;
  sender: {
    id: string;
    name: string;
    image?: string | null;
  };
};

export type ExtendedUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  about?: string | null;
};
