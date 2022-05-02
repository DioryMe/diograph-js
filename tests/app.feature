Feature: App

  Background:
    Given I have empty place for room
    And I initiate room

  Scenario: List rooms
    Then appData has 1 rooms
