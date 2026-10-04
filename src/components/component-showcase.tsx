"use client";

import { useT } from "@/components/locale-provider";
import { Bell, Check, Plus, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ComponentShowcase() {
  const t = useT();
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="buttons">{t("ui-component-showcase.001")}</TabsTrigger>
            <TabsTrigger value="form">{t("ui-component-showcase.002")}</TabsTrigger>
            <TabsTrigger value="badges">{t("ui-component-showcase.003")}</TabsTrigger>
            <TabsTrigger value="avatars">{t("ui-component-showcase.004")}</TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button>
                <Plus className="size-4" />{t("ui-component-showcase.005")}</Button>
              <Button variant="secondary">{t("ui-component-showcase.006")}</Button>
              <Button variant="outline">{t("ui-component-showcase.007")}</Button>
              <Button variant="ghost">{t("ui-component-showcase.008")}</Button>
              <Button variant="destructive">{t("ui-component-showcase.009")}</Button>
              <Button variant="link">{t("ui-component-showcase.010")}</Button>
            </div>
          </TabsContent>

          <TabsContent value="form" className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">{t("ui-component-showcase.011")}</label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="flex gap-2">
              <Input placeholder={t("ui-component-showcase.012")} className="max-w-xs" />
              <Button variant="outline" size="icon" aria-label={t("ui-component-showcase.013")}>
                <Search className="size-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{t("ui-component-showcase.014")}</Badge>
              <Badge variant="secondary">{t("ui-component-showcase.015")}</Badge>
              <Badge variant="outline">{t("ui-component-showcase.016")}</Badge>
              <Badge variant="destructive">{t("ui-component-showcase.017")}</Badge>
              <Badge className="gap-1 bg-green-600 hover:bg-green-600/90">
                <Check className="size-3" />{t("ui-component-showcase.018")}</Badge>
            </div>
          </TabsContent>

          <TabsContent value="avatars" className="mt-6">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AU
                </AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>UI</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="icon" aria-label={t("ui-component-showcase.019")}>
                <Bell className="size-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label={t("ui-component-showcase.020")}>
                <Settings className="size-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
