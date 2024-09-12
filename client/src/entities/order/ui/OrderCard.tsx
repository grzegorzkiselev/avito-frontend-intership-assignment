import { Accordion, Badge, Button, Card, Group, Text, Title } from "@mantine/core";
import { IconEye, IconHeart } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { ADVERTISEMENTS_PROPS, formatDate, formatRubles, Image } from "../../../shared";
import { Order, OrderStatus } from "../model/Order";
import { useUpdateOrder } from "../model/useUpdateOrder";
import classes from "./OrderCard.module.css";

const inclineWord = (number: number, nominative: string, genitive: string, genitivePlural: string) => {
  if (
    number === 1
  ) {
    return nominative;
  } else
    if (number < 4 && number > 1) {
      return genitive;
    } else {
      return genitivePlural;
    }
};

export const OrderCard = (order: Order) => {
  const { mutate } = useUpdateOrder();
  const itemsSum = order.items.reduce((sum, item) => {
    return sum + item.count;
  }, 0);

  const setOrderRecieved = () => {
    mutate({ id: order.id, status: OrderStatus["Received"] });
  };

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section} mt="xs">
        <Group justify="space-between">
          <Group>
            <Title order={2} fz="lg" fw={500}>
              Заказ №{ order.id }
            </Title>
            <Text fz="lg" fw={500}>
              { itemsSum } { inclineWord(itemsSum, "товар", "товара", "товаров") } на { formatRubles(order.total) }
            </Text>
          </Group>
          <Group>
            <Text fz="md" fw={400}>
              { formatDate(order.createdAt) }
            </Text>
            <Badge color="blue">{ Object.keys(OrderStatus)[order.status] }</Badge>
          </Group>
        </Group>
      </Card.Section>
      <Card.Section>
        <Accordion chevronPosition="right">
          {
            order.items.map((item) => {
              return <Accordion.Item value={item.id} key={"item-" + item.id + "-in-order-" + order.id}>
                <Accordion.Control>
                  <Group wrap="nowrap">
                    <Image src={item.imageUrl} radius="md" style={{ "fontSize": "0.8rem", "display": "block", "width": "56px", "flexBasis": "56px", "height": "56px" }} />
                    <div>
                      <Text>{item.name}</Text>
                      <Text size="sm" c="dimmed" fw={400}>
                        { item.count } { inclineWord(item.count, "штука", "штуки", "штук") }, { formatRubles(item.price) }
                      </Text>
                    </div>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  {
                    item.description
                      ? <Text fz="sm" >
                        { item.description }
                      </Text>
                      : null
                  }
                  <Card.Section className={classes.section}>
                    <Group justify="space-between" mt="md">
                      <Group justify="flex-end">
                        { (item.views || item.likes)
                          ? <>
                            { Number(item.views) ? <Group gap="xs" justify="flex-start"><IconEye />{ item.views }</Group> : null }
                            { Number(item.likes) ? <Group gap="xs" justify="flex-start"><IconHeart />{ item.likes }</Group> : null }
                          </>
                          : null
                        }
                      </Group>
                      <Button component={Link} to={"../" + ADVERTISEMENTS_PROPS.slug + "/" + item.id}>Перейти в объявление</Button>
                    </Group>
                  </Card.Section>
                </Accordion.Panel>
              </Accordion.Item>;
            })
          }
        </Accordion>

      </Card.Section>
      <Card.Section className={classes.section}>
        <Group justify="flex-end" mt="md">
          <Button disabled={ order.status > 3 } onClick={setOrderRecieved}>Завершить</Button>
        </Group>
      </Card.Section>
    </Card>
  );
};
