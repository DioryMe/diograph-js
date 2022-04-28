Feature: App

  Background:
    Given I have empty place for room
    And I initiate room

  Scenario: List rooms
    Then appData has 1 rooms

  Scenario: List clients
    When I add client to room
    Then appData has 1 client
