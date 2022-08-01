import * as React from 'react'
import {types} from '@dschu012/d2s'
import {OverlayTrigger, Popover} from 'react-bootstrap'
import type {StatDescriptionElement, ItemElement} from '../../types/components/inventory/Item'
import type {D2CItem} from '../../types/d2c'
import parse from 'html-react-parser'


const StatDescription: StatDescriptionElement = ({stat}) => {
  const format = (stat: types.IMagicProperty) => {
    if (!stat.description || stat.visible === false) {
      return null;
    }
    const ds = stat.description.split('\\n');
    return ds.map((d) => {
      const s = d.replace(/\\(.*?);/gi, (_, match) => `</div><div class="${match}">`);
      return `<div>${s}</div>`;
    }).reverse().join('');
  }
  const formatted = format(stat)
  if (!formatted) {
    return (
      <>
      </>
    )
  }
  return (
    <div className="blue">{parse(formatted)}</div>
  )
}

const Item: ItemElement = ({id, item, clazz = undefined, clickEvent = undefined, contextMenuEvent = undefined}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null)

  const socketStyle = (idx: number) => {
    const y = [[50], [25, 75], [5, 50, 95]];
    const x = [[50], [10, 90]];
    const i = idx;
    //console.log(item, item.total_nr_of_sockets)
    switch (item.total_nr_of_sockets) {
      case 1:
      case 2:
      case 3: {
        const j = item.total_nr_of_sockets - 1;
        if (item.inv_height > 2 || item.total_nr_of_sockets < 3) {
          return {
            transform: `translateX(-${x[0][0]}%) translateY(-${y[j][i]}%)`,
            top: `${y[j][i]}%`,
            left: `${x[0][0]}%`,
          };
        }
        const k = [y[2][0], y[2][2], y[2][2]];
        const l = [x[0][0], x[1][0], x[1][1]];
        return {
          transform: `translateX(-${l[i]}%) translateY(-${k[i]}%)`,
          top: `${k[i]}%`,
          left: `${l[i]}%`,
        };
      }
      case 4:
      case 6: {
        const j = (item.total_nr_of_sockets / 2) - 1;
        return {
          transform: `translateX(-${x[1][i % 2]}%) translateY(-${y[j][Math.floor(i / 2)]}%)`,
          top: `${y[j][Math.floor(i / 2)]}%`,
          left: `${x[1][i % 2]}%`,
        };
      }
      case 5: {
        const k = [y[2][0], y[2][0], y[2][2], y[2][2], y[2][1]];
        const l = [x[1][0], x[1][1], x[1][0], x[1][1], x[0][0]];
        return {
          transform: `translateX(-${l[i]}%) translateY(-${k[i]}%)`,
          top: `${k[i]}%`,
          left: `${l[i]}%`,
        };
      }
      default: {
        return {};
      }
    }
  }
  const itemName = (item: D2CItem) => {
    let name = item.type_name;
    if (item.magic_prefix_name) {
      name = `${item.magic_prefix_name} ${name}`;
    }
    if (item.magic_suffix_name) {
      name = `${name} ${item.magic_suffix_name}`;
    }
    if (item.rare_name) {
      name = `${item.rare_name} ${name}`;
    }
    if (item.rare_name2) {
      name = `${name} ${item.rare_name2}`;
    }
    const personalizedName = item.personalized_name ? `${item.personalized_name}'s ` : '';
    if (item.set_name) {
      name = `${name}\\n${personalizedName}${item.set_name}`;
    }
    if (item.unique_name) {
      name = `${name}\\n${personalizedName}${item.unique_name}`;
    }
    if (item.runeword_name) {
      const runes = item.socketed_items.map(e => e.type_name.split(' ')[0]).join('');
      name = `\\gold;'${runes}'\\n${name}\\n\\gold;${personalizedName}${item.runeword_name}`;
    }
    return name.split('\\n').map(d => {
      const s = d.replace(/\\(.*?);/gi, (_, match) => `</div><div class="${match}">`);
      return `<div>${s}</div>`;
    }).reverse().join('');
  }
  const itemNameClass = (item: D2CItem) => {
    if (item.given_runeword) {
      return 'white';
    }
    switch (item.quality) {
      case 1:
        return 'grey';
      case 2:
      case 3:
        return 'white';
      case 4:
        return 'blue';
      case 5:
        return 'green';
      case 6:
        return 'yellow';
      case 7:
        return 'gold';
      case 8:
        return 'orange';
      default:
        return 'white';
    }
  }
  const dragStart = () => {
    localStorage.setItem('dragElement', JSON.stringify({
      uuid: window.uuid,
      item: item
    }));
  }
  const itemClass = () => {
    let itemClass = `${clazz ? clazz : 'item'} w-${item.inv_width} h-${item.inv_height}`
    if (item.location_id === 2 && !clazz) {
      const posY = Math.floor((item.position_x) / 4)
      const posX = (item.position_x - ((posY * 4)))
      itemClass += ` x-${posX} y-${posY} pos-${item.position_x}`
    } else if (item.location_id !== 1 && !clazz) {
      itemClass += ` x-${item.position_x} y-${item.position_y}`
    }
    return itemClass
  }

  let socketedItems: Array<JSX.Element> = []
  if (item.socketed_items) {
    socketedItems = [];
    for(let idx = 0; idx < item.total_nr_of_sockets; idx++) {
      const style = socketStyle(idx)
      const socketedItem = (
        <div
          key={`socket-${idx}`}
          style={style}
          ref={ref}
          className={`socket ${item.socketed_items || !item.socketed_items[idx] ? 'empty-socket' : ''}`}
        >
          {item.socketed_items && item.socketed_items[idx] && (
            <img src={item.socketed_items[idx].src ?? ''} alt="socket"/>
          )}
        </div>
      )
      socketedItems.push(socketedItem)
    }
  }

  let statDescriptions: Array<JSX.Element> = []
  if (item.displayed_combined_magic_attributes) {
    statDescriptions = item.displayed_combined_magic_attributes.map((item, idx) => {
      return (
        <StatDescription key={`stat-${idx}`} stat={item}/>
      )
    })
  }

  const popover = (
    <Popover id={`itemInfo-${id}`}>
      <Popover.Content>
        <div
          className={`itemName ${itemNameClass(item)}`}
        >
          {parse(itemName(item))}
        </div>
        {item.quantity > 0 && (
          <div
            className="item-quantity"
          >
            Quantity: {item.quantity}
          </div>
        )}
        {item.defense_rating > 0 && (
          <div
            className="item-defense_rating"
          >
            Defense: {item.defense_rating}
          </div>
        )}
        {item.base_damage && (
          <div className="item-base_damage">
            {item.base_damage.mindam && item.base_damage.maxdam && (
              <div
                className="item-base_damage-onehand"
              >
                One Hand Damage: {item.base_damage.mindam} - {item.base_damage.maxdam}
              </div>
            )}
            {item.base_damage.twohandmindam && item.base_damage.twohandmaxdam && (
              <div
                className="item-base_damage-twohand"
              >
                Two Hand Damage: {item.base_damage.twohandmindam} - {item.base_damage.twohandmaxdam}
              </div>
            )}
          </div>
        )}
        {item.max_durability > 0 && (
          <div className="durability">
            Durability: {item.current_durability} of {item.max_durability}
          </div>
        )}
        {statDescriptions.length > 0 && (
          <div className="statDescriptions">
            {statDescriptions}
          </div>
        )}
        {item.ethereal > 0 && (
          <div className="blue">
            Ethereal
          </div>
        )}
        {item.total_nr_of_sockets && (
          <div className="noOfSockets blue">
            Socketed ({item.total_nr_of_sockets})
          </div>
        )}
      </Popover.Content>
    </Popover>
  )

  return (
    <div
      id={id}
      onClick={clickEvent}
      onContextMenu={contextMenuEvent}
    >
      <OverlayTrigger
        defaultShow={false}
        onToggle={() => setOpen(!open)}
        placement={'auto-end'}
        overlay={popover}
        transition={false}
      >
        {({ ref, ...triggerHandler }) => (
          <div
            tabIndex={0}
            ref={ref}
            className={itemClass()}
            {...triggerHandler}
            onDragStart={dragStart}
          >
            <img
              src={item.src ?? ''}
              className={item.ethereal > 0 ? 'ethereal' : ''}
              alt={'Image'}
            />
            {item.total_nr_of_sockets && open && (
              <div className="sockets">
                {socketedItems}
              </div>
            )}
          </div>
        )}
      </OverlayTrigger>
    </div>
  )
}

export default Item
