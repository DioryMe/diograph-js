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
