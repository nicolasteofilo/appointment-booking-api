export type SortDirection = "asc" | "desc";

export type SearchInput = {
	page?: number;
	perPage?: number;
	sort?: string | null;
	sortDir?: SortDirection | null;
	filter?: string | null;
};

export type SearchResult<T> = {
	items: T[];
	total: number;
	currentPage: number;
	perPage: number;
	filter: string | null;
};

export interface Repository<T, Id = string> {
	findById(id: Id): Promise<T | null>;
	insert(entity: T): Promise<T>;
	update(entity: T): Promise<T>;
	delete(id: Id): Promise<void>;
}

export interface SearchableRepository<T, Id = string>
	extends Repository<T, Id> {
	search(input: SearchInput): Promise<SearchResult<T>>;
}
