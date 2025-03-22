from django.test import SimpleTestCase
from django.urls import resolve, reverse

class RouterTest(SimpleTestCase):
    def test_test_block_list_url_resolves(self):
        """Проверяем, что URL '/test_block/' ведет к правильному представлению."""
        url = reverse('test_block-list')
        found = resolve(url)
        self.assertEqual(found.func.__name__, 'TestBlockViewSet.list')

    def test_test_block_detail_url_resolves(self):
        """Проверяем, что URL '/test_block/1/' ведет к правильному представлению."""
        url = reverse('test_block-detail', kwargs={'pk': 1})
        found = resolve(url)
        self.assertEqual(found.func.__name__, 'TestBlockViewSet.retrieve_test_block')

    def test_test_block_reset_answers_url_resolves(self):
        """Проверяем, что URL '/test_block/1/reset_answers/' ведет к правильному представлению."""
        url = reverse('test_block-reset-answers', kwargs={'pk': 1})
        found = resolve(url)
        self.assertEqual(found.func.__name__, 'TestBlockViewSet.reset_answers')