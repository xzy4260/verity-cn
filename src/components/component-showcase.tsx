"use client";

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
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="buttons">按钮</TabsTrigger>
            <TabsTrigger value="form">表单</TabsTrigger>
            <TabsTrigger value="badges">徽章</TabsTrigger>
            <TabsTrigger value="avatars">头像</TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button>
                <Plus className="size-4" />
                主要
              </Button>
              <Button variant="secondary">次要</Button>
              <Button variant="outline">描边</Button>
              <Button variant="ghost">幽灵</Button>
              <Button variant="destructive">危险</Button>
              <Button variant="link">链接</Button>
            </div>
          </TabsContent>

          <TabsContent value="form" className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                邮箱
              </label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="flex gap-2">
              <Input placeholder="搜索…" className="max-w-xs" />
              <Button variant="outline" size="icon" aria-label="搜索">
                <Search className="size-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>默认</Badge>
              <Badge variant="secondary">次要</Badge>
              <Badge variant="outline">描边</Badge>
              <Badge variant="destructive">危险</Badge>
              <Badge className="gap-1 bg-green-600 hover:bg-green-600/90">
                <Check className="size-3" />
                已验证
              </Badge>
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
              <Button variant="outline" size="icon" aria-label="通知">
                <Bell className="size-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="设置">
                <Settings className="size-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
