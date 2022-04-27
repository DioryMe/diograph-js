Feature: App

  Background:
    Given I have empty place for room
    And I initiate room

#     Given I have no room clients
#     And I have no clients
#     When I configure a room client

  Scenario: List rooms
    Then I can call listRooms operation for app

#   Scenario: List room client without connecting
#     When I list rooms
#     Then I receive one disconnected room

#   Scenario: List content sources client without connecting
#     When I list content sources
#     Then I receive no content sources

#   Scenario: List room clients after connecting
#     When I initate a connection to a room with room client
#     And I load room
#     And I list rooms
#     Then I receive one connected room

  Scenario: List clients
    When I add client to room
    Then I can call listClients operation for app

  # Scenario: List clients after loading a room with one client
  #   When I initate a connection to a room with room client
  #   And I load a room with one client
  #   And I list clients
  #   Then I receive one client

#   Scenario: Remove room client without deleting it
#     When I initate a connection to a room with room client
#     And I load a room
#     And I remove room client from app-data
#     And I list room clients
#     Then I receive no room clients

#   Scenario: Remove client
#     When I initate a connection to a room with room client
#     And I load a room with one client
#     And I remove clients from app-data
#     And I list clients
#     Then I receive no clients
