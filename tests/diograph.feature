Feature: Diograph

  Background:
    Given I have empty place for room
    And I initiate a room

  Scenario: Get diory
    When I call getDiory for diograph
    Then I receive a diory

  Scenario: Create diory
    When I call createDiory for diograph
    Then diograph.json has 2 diories

  Scenario: Import diory
    When I call importDiory
    Then diograph.json has 2 diories
    And images folder has 1 image
    And content folder has 0 file

  Scenario: Import diory with content
    When I call importDiory with content
    Then diograph.json has 2 diories
    And images folder has 1 image
    And content folder has 1 file
