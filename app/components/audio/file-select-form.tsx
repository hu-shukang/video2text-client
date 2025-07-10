import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FileSelectForm() {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="file" accept="audio/*" />
      <Button type="submit" variant="outline">
        アップロード
      </Button>
    </div>
  );
}
