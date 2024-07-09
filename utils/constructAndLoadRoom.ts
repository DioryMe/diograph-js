import { Connection } from '../diosphere/connection'
import { Room } from '../diosphere/room'
import { RoomClient } from '../diosphere/roomClient'
import { ConnectionClient, ConnectionClientList, ConnectionData, IDiographObject } from '../types'

export const getClientAndVerify = async (
  address: string,
  clientType: string,
  availableClients: ConnectionClientList,
): Promise<ConnectionClient> => {
  const clientData = availableClients[clientType]

  if (!clientData) {
    throw new Error(
      `getClientAndVerify: Unknown clientType or incomplete availableClients data for ${clientType}`,
    )
  }

  const client = new clientData.clientConstructor(address, clientData.credentials)
  await client.verify()

  return client
}

export const constructRoom = async (
  address: string,
  roomClientType: string,
  availableClients: ConnectionClientList,
): Promise<Room> => {
  // NOTE: If address doesn't exist error is thrown instead of creating new folder (=LocalClient) or key (=S3Client) etc.
  // - this is non-client specific code and such logic should be implemented to the client (both LocalClient and S3Client)
  // - user needs to provide only addresses that exist (although that can't be verified...)
  const client = await getClientAndVerify(address, roomClientType, availableClients)
  const roomClient = new RoomClient(client)
  return new Room(roomClient)
}

export const constructAndLoadRoom = async (
  address: string,
  roomClientType: string,
  availableClients: ConnectionClientList,
  connectionData?: ConnectionData[],
  diographObject?: IDiographObject,
): Promise<Room> => {
  const room = await constructRoom(address, roomClientType, availableClients)
  await room.loadOrInitiateRoom(availableClients, connectionData, diographObject)
  return room
}

export const constructAndLoadRoomWithNativeConnection = async (
  address: string,
  roomClientType: string,
  availableClients: ConnectionClientList,
  connectionData?: ConnectionData[],
  diographObject?: IDiographObject,
): Promise<Room> => {
  const room = await constructAndLoadRoom(
    address,
    roomClientType,
    availableClients,
    connectionData,
    diographObject,
  )
  const nativeConnection = new Connection(
    await getClientAndVerify(
      `${
        address[address.length - 1] === '/' ? address.slice(0, address.length - 1) : address
      }/Diory Content`,
      roomClientType,
      availableClients,
    ),
  )
  room.addConnection(nativeConnection)

  return room
}
