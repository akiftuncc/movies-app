// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.5
//   protoc               v5.28.2
// source: ticket.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { ResponseStatus } from "./general";

export const protobufPackage = "ticket";

/** src/proto/ticket.proto */

export interface Ticket {
  id: string;
  ticketNumber: number;
  userId: string;
  sessionId: string;
}

export interface BuyTicketRequest {
  userId: string;
  sessionId: string;
}

export interface BuyTicketResponse {
  ticket: Ticket | undefined;
  status: ResponseStatus | undefined;
}

export interface WatchMovieRequest {
  userId: string;
  ticketId: string;
}

export interface WatchMovieResponse {
  status: ResponseStatus | undefined;
}

function createBaseTicket(): Ticket {
  return { id: "", ticketNumber: 0, userId: "", sessionId: "" };
}

export const Ticket: MessageFns<Ticket> = {
  encode(message: Ticket, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.ticketNumber !== 0) {
      writer.uint32(16).int32(message.ticketNumber);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.sessionId !== "") {
      writer.uint32(34).string(message.sessionId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Ticket {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTicket();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.ticketNumber = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.userId = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.sessionId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Ticket {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      ticketNumber: isSet(object.ticketNumber) ? globalThis.Number(object.ticketNumber) : 0,
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      sessionId: isSet(object.sessionId) ? globalThis.String(object.sessionId) : "",
    };
  },

  toJSON(message: Ticket): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.ticketNumber !== 0) {
      obj.ticketNumber = Math.round(message.ticketNumber);
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.sessionId !== "") {
      obj.sessionId = message.sessionId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Ticket>, I>>(base?: I): Ticket {
    return Ticket.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Ticket>, I>>(object: I): Ticket {
    const message = createBaseTicket();
    message.id = object.id ?? "";
    message.ticketNumber = object.ticketNumber ?? 0;
    message.userId = object.userId ?? "";
    message.sessionId = object.sessionId ?? "";
    return message;
  },
};

function createBaseBuyTicketRequest(): BuyTicketRequest {
  return { userId: "", sessionId: "" };
}

export const BuyTicketRequest: MessageFns<BuyTicketRequest> = {
  encode(message: BuyTicketRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.sessionId !== "") {
      writer.uint32(18).string(message.sessionId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): BuyTicketRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBuyTicketRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.sessionId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BuyTicketRequest {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      sessionId: isSet(object.sessionId) ? globalThis.String(object.sessionId) : "",
    };
  },

  toJSON(message: BuyTicketRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.sessionId !== "") {
      obj.sessionId = message.sessionId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BuyTicketRequest>, I>>(base?: I): BuyTicketRequest {
    return BuyTicketRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BuyTicketRequest>, I>>(object: I): BuyTicketRequest {
    const message = createBaseBuyTicketRequest();
    message.userId = object.userId ?? "";
    message.sessionId = object.sessionId ?? "";
    return message;
  },
};

function createBaseBuyTicketResponse(): BuyTicketResponse {
  return { ticket: undefined, status: undefined };
}

export const BuyTicketResponse: MessageFns<BuyTicketResponse> = {
  encode(message: BuyTicketResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.ticket !== undefined) {
      Ticket.encode(message.ticket, writer.uint32(10).fork()).join();
    }
    if (message.status !== undefined) {
      ResponseStatus.encode(message.status, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): BuyTicketResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBuyTicketResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.ticket = Ticket.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.status = ResponseStatus.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BuyTicketResponse {
    return {
      ticket: isSet(object.ticket) ? Ticket.fromJSON(object.ticket) : undefined,
      status: isSet(object.status) ? ResponseStatus.fromJSON(object.status) : undefined,
    };
  },

  toJSON(message: BuyTicketResponse): unknown {
    const obj: any = {};
    if (message.ticket !== undefined) {
      obj.ticket = Ticket.toJSON(message.ticket);
    }
    if (message.status !== undefined) {
      obj.status = ResponseStatus.toJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BuyTicketResponse>, I>>(base?: I): BuyTicketResponse {
    return BuyTicketResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BuyTicketResponse>, I>>(object: I): BuyTicketResponse {
    const message = createBaseBuyTicketResponse();
    message.ticket = (object.ticket !== undefined && object.ticket !== null)
      ? Ticket.fromPartial(object.ticket)
      : undefined;
    message.status = (object.status !== undefined && object.status !== null)
      ? ResponseStatus.fromPartial(object.status)
      : undefined;
    return message;
  },
};

function createBaseWatchMovieRequest(): WatchMovieRequest {
  return { userId: "", ticketId: "" };
}

export const WatchMovieRequest: MessageFns<WatchMovieRequest> = {
  encode(message: WatchMovieRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.ticketId !== "") {
      writer.uint32(18).string(message.ticketId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): WatchMovieRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWatchMovieRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.ticketId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WatchMovieRequest {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      ticketId: isSet(object.ticketId) ? globalThis.String(object.ticketId) : "",
    };
  },

  toJSON(message: WatchMovieRequest): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.ticketId !== "") {
      obj.ticketId = message.ticketId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WatchMovieRequest>, I>>(base?: I): WatchMovieRequest {
    return WatchMovieRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<WatchMovieRequest>, I>>(object: I): WatchMovieRequest {
    const message = createBaseWatchMovieRequest();
    message.userId = object.userId ?? "";
    message.ticketId = object.ticketId ?? "";
    return message;
  },
};

function createBaseWatchMovieResponse(): WatchMovieResponse {
  return { status: undefined };
}

export const WatchMovieResponse: MessageFns<WatchMovieResponse> = {
  encode(message: WatchMovieResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.status !== undefined) {
      ResponseStatus.encode(message.status, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): WatchMovieResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWatchMovieResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.status = ResponseStatus.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WatchMovieResponse {
    return { status: isSet(object.status) ? ResponseStatus.fromJSON(object.status) : undefined };
  },

  toJSON(message: WatchMovieResponse): unknown {
    const obj: any = {};
    if (message.status !== undefined) {
      obj.status = ResponseStatus.toJSON(message.status);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<WatchMovieResponse>, I>>(base?: I): WatchMovieResponse {
    return WatchMovieResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<WatchMovieResponse>, I>>(object: I): WatchMovieResponse {
    const message = createBaseWatchMovieResponse();
    message.status = (object.status !== undefined && object.status !== null)
      ? ResponseStatus.fromPartial(object.status)
      : undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
