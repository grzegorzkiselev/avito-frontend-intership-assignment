import { Button, Card, DEFAULT_THEME, Group, px, Spoiler, Text, Title } from "@mantine/core";
import { IconEye, IconHeart } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { formatRubles, Image } from "../../../shared";
import { Advertisement } from "../model";
import classes from "./AdvertisementCard.module.css";

const calcHeightInPxByRows = (fontSizeInRem: number, lineHeightRatio: number, rowsCount: number): number => {
  return Number(px(rowsCount * (fontSizeInRem * lineHeightRatio) + "rem"));
};

export const AdvertisementCard = ({ id, name, description, price, views, likes, imageUrl, bottom }: Advertisement & { bottom?: boolean }) => {
  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        {
          (
            (children) => {
              return bottom ? children : <Link to={`/advertisements/${id}`} state={{ refferer: window.location.href }}>{children}</Link>;
            }
          )(
            <Image src={imageUrl || ""} alt={name} height={360} />,
          )
        }
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Title order={2} fz="lg" fw={500}>
            { name }
          </Title>
        </Group>
        <Text fz="md" fw={500}>
          {
            formatRubles(price)
          }
        </Text>

        { description
          ? <Spoiler
            maxHeight={ calcHeightInPxByRows(0.875, Number(DEFAULT_THEME.lineHeights["md"]), 3) }
            showLabel="Показать больше"
            hideLabel="Скрыть"
          >
            <Text fz="sm" >
              { description }
            </Text>
          </Spoiler>
          : null
        }
      </Card.Section>

      { <Card.Section className={classes.section}>
        <Group justify="space-between" mt="md">
          <Group justify="flex-end">
            { Number(views) ? <Group gap="xs" justify="flex-start"><IconEye />{ views }</Group> : null }
            { Number(likes) ? <Group gap="xs" justify="flex-start"><IconHeart />{ likes }</Group> : null }
          </Group>

          {/* @todo move link generation into upper scope */}
          { <Button component="a" href={"../" + `orders?forItem=${id}`}>Заказы</Button> }

        </Group>
      </Card.Section>
      }
    </Card>
  );
};
