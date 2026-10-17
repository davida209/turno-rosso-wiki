import test from "node:test";
import assert from "node:assert/strict";
import {
  searchMechanics,
  trainingScore,
  ranking,
  characters,
} from "../src/model.js";
test("guide search handles accents and actual store mechanics", () => {
  assert.ok(searchMechanics("reputacion").some((m) => m.id === "reputacion"));
  assert.ok(searchMechanics("caja ladron").some((m) => m.id === "ladron"));
  assert.equal(searchMechanics("café").length, 0);
  assert.equal(characters.length, 4);
});
test("training records points and win condition accurately", () => {
  assert.deepEqual(trainingScore([1, 0, 2, 0, 1]), {
    correct: 5,
    total: 5,
    score: 1250,
    result: "Ganó",
  });
  assert.equal(trainingScore([0, 0, 0, 0, 0]).result, "Perdió");
  assert.throws(() => trainingScore([1, 0]));
});
test("ranking filters and sorts without changing saved rows", () => {
  const rows = [
    { name: "A", score: 250, result: "Perdió" },
    { name: "B", score: 1250, result: "Ganó" },
  ];
  assert.equal(ranking(rows)[0].name, "B");
  assert.equal(ranking(rows, "Ganó").length, 1);
  assert.equal(rows[0].name, "A");
});
