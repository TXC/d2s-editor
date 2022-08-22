import * as React from 'react'
import * as d2s from '@dschu012/d2s'
import {D2CS} from '../types'
import MessageViewer from './MessageViewer'
import Character from './Character'
import {Button, ButtonGroup, Col, Container, Nav, Row, Tab} from 'react-bootstrap'
import Stats from './Stats'
import Waypoints from './Waypoints'
import NPC from './NPC'
import Quests from './Quests'
import Skills from './Skills'
import Items from './Items'
import Mercenary from './Mercenary'
import {updateSaveData, onEvent, Hook} from './App'
import type {paste} from './App'

type RowBottomProps = {
  saveData: D2CS | null;
  updateSaveData: updateSaveData;
}
const RowBottom = ({saveData, updateSaveData}: RowBottomProps) => {
  const maxGold = () => {
    if (saveData === null) {
      return;
    }
    const newData = saveData
    newData.attributes.gold = saveData.header.level * 10000
    newData.attributes.stashed_gold = 2500000
    updateSaveData(newData)
  }
  const unlockQs = () => {
    if (saveData === null) {
      return;
    }
    const newData = saveData

    function update(difficulty: string, act: string, quest: string, attributes: Array<string> | null, amount: number | null) {
      if (newData === null) {
        return;
      }

      // @ts-ignore
      if (!newData.header[difficulty]) {
        // @ts-ignore
        newData.header[difficulty] = {}
      }

      // @ts-ignore
      if (!newData.header[difficulty][act]) {
        // @ts-ignore
        newData.header[difficulty][act] = {}
      }
      // @ts-ignore
      if (!newData.header[difficulty][act][quest]) {
        // @ts-ignore
        newData.header[difficulty][act][quest] = {}
      }
      // @ts-ignore
      if (newData.header[difficulty][act][quest].is_completed === false) {
        // @ts-ignore
        newData.header[difficulty][act][quest].is_completed = true;
        if (quest === 'prison_of_ice') {
          // @ts-ignore
          newData.header[difficulty][act][quest].consumed_scroll = true;
        } else {
          if (attributes === null) {
            return
          }
          if (amount === null) {
            amount = 0
          }
          for (const attribute of attributes) {
            newData.attributes[attribute] = (newData.attributes[attribute] ?? 0) + amount;
          }
        }
      }
    }

    for (const diff of ['quests_normal', 'quests_nm', 'quests_hell']) {
      update(diff, 'act_i', 'den_of_evil', ['unused_skill_points'], 1);
      update(diff, 'act_ii', 'radaments_lair', ['unused_skill_points'], 1);
      update(diff, 'act_iii', 'lam_esens_tome', ['unused_stats'], 5);
      update(diff, 'act_iii', 'the_golden_bird', ['max_hp', 'current_hp'], 20);
      update(diff, 'act_iv', 'the_fallen_angel', ['unused_skill_points'], 2);
      update(diff, 'act_v', 'prison_of_ice', null, null);
    }
    updateSaveData(newData)
  }
  const unlockHell = () => {
    if (saveData === null) {
      return;
    }
    const newData = saveData
    for (const i of ['quests_normal', 'quests_nm', 'quests_hell']) {
      // @ts-ignore
      if (!newData.header[i]) {
        // @ts-ignore
        newData.header[i] = {}
      }

      for (const j of ['act_i', 'act_ii', 'act_iii', 'act_iv', 'act_v']) {
        // @ts-ignore
        if (!newData.header[i][j]) {
          // @ts-ignore
          newData.header[i][j] = null
        }

        // @ts-ignore
        newData.header[i][j].introduced = true;
        // @ts-ignore
        newData.header[i][j].completed = true;
      }
      // @ts-ignore
      newData.header[i].act_i.sisters_to_the_slaughter.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.the_summoner.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.tainted_sun.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.the_horadric_staff.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.arcane_sanctuary.is_completed = true;
      // @ts-ignore
      newData.header[i].act_ii.the_seven_tombs.is_completed = true;
      // @ts-ignore
      newData.header[i].act_iii.khalims_will.is_completed = true;
      // @ts-ignore
      newData.header[i].act_iii.the_blackened_temple.is_completed = true;
      // @ts-ignore
      newData.header[i].act_iii.the_guardian.is_completed = true;
      // @ts-ignore
      newData.header[i].act_iv.terrors_end.is_completed = true;
      // @ts-ignore
      newData.header[i].act_v.rite_of_passage.is_completed = true;
      // @ts-ignore
      newData.header[i].act_v.eve_of_destruction.is_completed = true;
    }

    for (const i of ['normal', 'nm', 'hell']) {
      // @ts-ignore
      if (!newData.header.waypoints[i]) {
        // @ts-ignore
        newData.header.waypoints[i] = {}
      }

      // @ts-ignore
      newData.header.waypoints[i].act_i.rogue_encampement = true;
      // @ts-ignore
      newData.header.waypoints[i].act_ii.lut_gholein = true;
      // @ts-ignore
      newData.header.waypoints[i].act_iii.kurast_docks = true;
      // @ts-ignore
      newData.header.waypoints[i].act_iv.the_pandemonium_fortress = true;
      // @ts-ignore
      newData.header.waypoints[i].act_v.harrogath = true;
    }
    newData.header.progression = 15;
    updateSaveData(newData)
  }
  const unlockAllWPs = () => {
    if (saveData === null) {
      return
    }
    const newData = saveData
    for (const i of ['normal', 'nm', 'hell']) {
      // @ts-ignore
      for (const a in newData.header.waypoints[i]) {
        // @ts-ignore
        for (const w in newData.header.waypoints[i][a]) {
          // @ts-ignore
          newData.header.waypoints[i][a][w] = true;
        }
      }
    }
    updateSaveData(newData)
  }
  const setLvl99 = () => {
    if (saveData === null) {
      return
    }
    const newData = saveData
    newData.header.level = 99;
    updateSaveData(newData)
  }
  const setAllSkills20 = () => {
    if (saveData === null) {
      return;
    }
    const newData = saveData
    for (let i = 0; i < saveData.skills.length; i++) {
      newData.skills[i].points = 20;
    }
    updateSaveData(newData)
  }
  const saveFile = (version: number) => {
    if (saveData === null) {
      return;
    }

    const newData = saveData
    newData.header.version = version
    updateSaveData(newData)

    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    d2s.write(saveData, window.constants.constants).then(response => {
      const blob = new Blob([response], {type: 'octet/stream'});
      link.href = window.URL.createObjectURL(blob);
      link.download = saveData.header.name + '.d2s';
      link.click();
      link.remove();
    });
  }

  return (
    <Container fluid>
      <Row xs={1}>
        <Col xs={12} className="mb-2">
          <ButtonGroup className="mr-2">
            <Button onClick={unlockHell}>Unlock Hell</Button>
            <Button onClick={unlockAllWPs}>Unlock All WPs</Button>
            <Button onClick={setLvl99}>Set Level 99</Button>
            <Button onClick={setAllSkills20}>Set All Skills 20</Button>
            <Button onClick={unlockQs}>Complete Skill/Stat Qs</Button>
            <Button onClick={maxGold}>Max Gold</Button>
          </ButtonGroup>
        </Col>
      </Row>

      <Row xs={1}>
        <Col xs={12}>
          <ButtonGroup className="mr-2">
            <Button onClick={() => saveFile(0x60)}>Save D2</Button>
            <Button onClick={() => saveFile(0x61)}>Save D2R</Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  )
}

type MainContentProps = {
  hook: Hook
  saveData: D2CS | null;
  updateSaveData: (newData: D2CS|null) => void;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  onEvent: onEvent
  paste: paste;
}
const MainContent = ({
  hook,
  saveData,
  updateSaveData,
  activeTab,
  setActiveTab,
  onEvent,
  paste
}: MainContentProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState<string>('stats');
  const id = React.useId()

  return (
    <div className="row">
      <div className="offset-lg-2 col-lg-8 mt-2">
        <div className="card bg-light">
          <div className="card-body">
            <div className="alert alert-primary" role="alert">
              This editor is still a work in progress. Some things may not work. Found a bug? <a
              href="https://github.com/TXC/d2s-editor/issues/new">Report it.</a>
            </div>
            <form id={id}>
              <fieldset>
                <Character updateSaveData={updateSaveData} />
                <MessageViewer hook={hook}/>
                {saveData !== null && (
                  <Tab.Container
                    id={'tabs'}
                    defaultActiveKey={selectedIndex}
                    onSelect={(e) => {
                      if (e) {
                        setSelectedIndex(e)
                      }
                    }}
                  >
                    <Nav variant={'tabs'}>
                      <Nav.Item>
                        <Nav.Link eventKey="stats">Stats</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="waypoints">Waypoints</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="npcs">NPCs</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="quests">Quests</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="skills">Skills</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="items">Items</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="mercenary">Mercenary</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content className="main">
                      <Tab.Pane eventKey={'stats'} transition={false}>
                        <Stats
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'waypoints'} transition={false}>
                        <Waypoints
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'npcs'} transition={false}>
                        <NPC
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'quests'} transition={false}>
                        <Quests
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'skills'} transition={false}>
                        <Skills
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'items'} transition={false}>
                        <Items
                          hook={hook}
                          saveData={saveData}
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                          onEvent={onEvent}
                          paste={paste}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey={'mercenary'} transition={false}>
                        <Mercenary
                          id={`${id}-mercenary`}
                          hook={hook}
                          saveData={saveData}
                          updateSaveData={updateSaveData}
                        />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                )}
              </fieldset>
              {saveData !== null && (
                <>
                  <br/>
                  <RowBottom
                    saveData={saveData}
                    updateSaveData={updateSaveData}
                  />
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainContent
