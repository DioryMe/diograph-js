Feature: Diograph

  Background:
    Given I have initiated a room

  Scenario: Get diory
    When I call getDiory for diograph
    Then I receive a diory

  Scenario: Create diory
    When I call createDiory for diograph
    Then diograph.json has 2 diories

  Scenario: Import diory
    When I call importDiory for diograph
    # Then diograph.json has 2 diories
    And images folder has 1 image
