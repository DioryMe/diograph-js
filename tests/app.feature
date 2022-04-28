Feature: App

  Background:
    Given I have empty place for room
    And I initiate room

  Scenario: List rooms
    Then I can call listRooms operation for app

  Scenario: List clients
    When I add client to room
    Then I can call listClients operation for app
