Feature: Diograph

  Background:
    Given I have initiated a room

  Scenario: Get diory
    When I call getDiory for diograph
    Then I receive a diory

  Scenario: Create diory
    When I call createDiory for diograph
    # Then diograph.json has two diories
